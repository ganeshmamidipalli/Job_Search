import Anthropic from '@anthropic-ai/sdk';
import { getWikiFull } from '@/lib/wiki-context';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { company, role, archetype, jobDescription } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    // Use FULL wiki for resume -- need all experience details for 2-3 pages
    const wiki = getWikiFull();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `You are generating a FULL 2-3 page ATS-optimized resume for Ganesh Hemanth Mamidipalli, tailored for a specific job. Use the complete professional profile below.

OUTPUT: Return a JSON object with the full resume content structured by section. Every section must be detailed and substantial.

RULES:
- No em dashes. Use hyphens instead.
- Every bullet must have a concrete metric or number
- Lead with impact and results, not technology names
- GCP is primary cloud, mention first. AWS is secondary
- Tailor the summary, bullet ordering, and emphasis to match the JD
- Include ALL relevant experience - this must fill 2-3 pages when formatted
- Each role must have 5-8 detailed bullets
- Skills section must be comprehensive
- Include projects, certifications, education

Return JSON:
{
  "name": "GANESH HEMANTH MAMIDIPALLI",
  "contact": "mganeshhemanth@gmail.com | +1 (316) 210-1890 | ganeshmamidipalli.com | linkedin.com/in/ganesh-mamidipalli-951a95102",
  "summary": "4-5 sentence tailored professional summary for this specific role",
  "skills": {
    "GenAI & LLMs": "...",
    "ML & Deep Learning": "...",
    "MLOps & Infrastructure": "...",
    "Cloud": "...",
    "Programming": "..."
  },
  "experience": [
    {
      "title": "AI Engineer - GCP & MLOps Platform",
      "company": "National Institute for Aviation Research (NIAR), Wichita State University",
      "location": "Wichita, KS",
      "dates": "Jan 2025 - Present",
      "bullets": ["bullet with metric", "bullet with metric", ...]
    }
  ],
  "projects": [
    {"name": "Project Name", "description": "1-2 sentence with metrics"}
  ],
  "education": [
    {"degree": "...", "school": "...", "details": "..."}
  ],
  "certifications": ["cert1", "cert2", ...],
  "keywords": ["keyword1", "keyword2", ...]
}

CANDIDATE PROFILE:
${wiki}`,
      messages: [
        {
          role: 'user',
          content: `Generate a FULL tailored resume for:\nCompany: ${company}\nRole: ${role}\nArchetype: ${archetype}\n\nJOB DESCRIPTION:\n${jobDescription?.substring(0, 4000) || 'Not provided'}`,
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
        return Response.json({ error: 'Failed to parse resume' }, { status: 500 });
      }
    }

    const companySlug = company.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const filename = `Ganesh_Mamidipalli_AI_Engineer_${companySlug}`;

    // Generate print-ready HTML resume
    const html = generateResumeHTML(result, filename);

    return Response.json({
      ...result,
      filename,
      html,
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (err) {
    return Response.json({ error: `Resume generation failed: ${String(err)}` }, { status: 500 });
  }
}

function generateResumeHTML(data: any, filename: string): string {
  const skills = Object.entries(data.skills || {})
    .map(([cat, items]) => `<div><strong>${cat}:</strong> ${items}</div>`)
    .join('');

  const experience = (data.experience || [])
    .map((exp: any) => `
      <div class="role">
        <div class="role-header">
          <div><strong>${exp.title}</strong> | ${exp.company}</div>
          <div>${exp.location} | ${exp.dates}</div>
        </div>
        <ul>${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>
      </div>`)
    .join('');

  const projects = (data.projects || [])
    .map((p: any) => `<li><strong>${p.name}:</strong> ${p.description}</li>`)
    .join('');

  const education = (data.education || [])
    .map((e: any) => `<div><strong>${e.degree}</strong> - ${e.school}${e.details ? ` | ${e.details}` : ''}</div>`)
    .join('');

  const certs = (data.certifications || [])
    .map((c: string) => `<li>${c}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>${filename}</title>
<style>
  @page { margin: 0.5in; size: letter; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Helvetica Neue', Arial, sans-serif; font-size: 10.5pt; line-height: 1.4; color: #1a1a1a; max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
  h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 2px; letter-spacing: 1px; }
  .contact { text-align: center; font-size: 9.5pt; color: #444; margin-bottom: 12px; }
  h2 { font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #1a1a1a; margin: 12px 0 6px; padding-bottom: 2px; letter-spacing: 0.5px; }
  .summary { margin-bottom: 8px; font-size: 10.5pt; }
  .skills { font-size: 9.5pt; }
  .skills div { margin-bottom: 3px; }
  .role { margin-bottom: 10px; }
  .role-header { display: flex; justify-content: space-between; font-size: 10.5pt; margin-bottom: 4px; flex-wrap: wrap; }
  ul { margin-left: 16px; margin-top: 3px; }
  li { margin-bottom: 3px; font-size: 10pt; }
  .projects li { margin-bottom: 4px; }
  @media print { body { padding: 0; } }
  @media screen { body { background: #f5f5f5; padding: 0.75in; box-shadow: 0 0 20px rgba(0,0,0,0.1); background: white; margin: 20px auto; } }
</style>
</head><body>
<h1>${data.name || 'GANESH HEMANTH MAMIDIPALLI'}</h1>
<div class="contact">${data.contact || ''}</div>

<h2>Professional Summary</h2>
<div class="summary">${data.summary || ''}</div>

<h2>Technical Skills</h2>
<div class="skills">${skills}</div>

<h2>Professional Experience</h2>
${experience}

<h2>Projects</h2>
<ul class="projects">${projects}</ul>

<h2>Education</h2>
${education}

<h2>Certifications & Honors</h2>
<ul>${certs}</ul>
</body></html>`;
}
