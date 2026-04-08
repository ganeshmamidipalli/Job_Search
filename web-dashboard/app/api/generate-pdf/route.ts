import Anthropic from '@anthropic-ai/sdk';
import { getWikiCondensed } from '@/lib/wiki-context';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { company, role, archetype, jobDescription } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Use Sonnet for resume tailoring (fast, cheap, good enough)
    const wiki = getWikiCondensed();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are a resume tailoring expert for Ganesh Mamidipalli. Given a JD, generate a tailored professional summary (3-4 sentences) and a list of 6-8 key bullet points from his experience that best match this role. Use the candidate profile below.

RULES: No em dashes. Concrete numbers always. Lead with impact. ATS-friendly language. GCP-first positioning.

Return JSON:
{
  "summary": "tailored professional summary",
  "bullets": ["bullet 1", "bullet 2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "coverLetterDraft": "2-3 paragraph cover letter draft"
}

CANDIDATE PROFILE:
${wiki}`,
      messages: [
        {
          role: 'user',
          content: `Tailor resume for:\nCompany: ${company}\nRole: ${role}\nArchetype: ${archetype}\n\nJOB DESCRIPTION:\n${jobDescription?.substring(0, 3000) || 'Not provided'}`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code block
      const jsonMatch = text.match(/```json?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        result = {
          summary: text,
          bullets: [],
          keywords: [],
          coverLetterDraft: '',
        };
      }
    }

    // Store to Vercel Blob if available
    let blobUrl = null;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const slug = company.toLowerCase().replace(/\s+/g, '-');
        const date = new Date().toISOString().split('T')[0];
        const filename = `resumes/${slug}-${date}.json`;
        const blob = await put(filename, JSON.stringify(result, null, 2), {
          access: 'public',
          contentType: 'application/json',
        });
        blobUrl = blob.url;
      } catch {
        // Blob not configured, skip
      }
    }

    return Response.json({
      ...result,
      blobUrl,
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (err) {
    return Response.json(
      { error: `PDF generation failed: ${String(err)}` },
      { status: 500 }
    );
  }
}
