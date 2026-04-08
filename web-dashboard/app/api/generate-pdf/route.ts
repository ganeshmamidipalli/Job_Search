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

    const wiki = getWikiCondensed();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are a resume tailoring expert for Ganesh Mamidipalli. Given a JD, generate a tailored professional summary (3-4 sentences) and 6-8 key bullet points from his experience that best match this role.

RULES: No em dashes. Concrete numbers always. Lead with impact not technology. ATS-friendly. GCP-first positioning. No cover letter.

Return JSON only:
{
  "summary": "tailored professional summary",
  "bullets": ["bullet 1", "bullet 2", ...],
  "keywords": ["keyword1", "keyword2", ...]
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
      const jsonMatch = text.match(/```json?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        result = { summary: text, bullets: [], keywords: [] };
      }
    }

    // File naming: Ganesh_Mamidipalli_AI_Engineer_CompanyName
    const companySlug = company.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const filename = `Ganesh_Mamidipalli_AI_Engineer_${companySlug}`;

    // Store to Vercel Blob if available
    let blobUrl = null;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`resumes/${filename}.json`, JSON.stringify(result, null, 2), {
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
      filename,
      blobUrl,
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (err) {
    return Response.json(
      { error: `Resume generation failed: ${String(err)}` },
      { status: 500 }
    );
  }
}
