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

    const wiki = getWikiFull();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: `You generate a FULL 3-page ATS-optimized resume for Ganesh Hemanth Mamidipalli tailored to a specific JD. Use the complete profile below. The resume must be COMPREHENSIVE - every section filled, every role detailed.

CRITICAL RULES:
- Use the EXACT experience, metrics, and projects from the profile. Do NOT invent anything.
- Tailor by: rewriting summary for this role, reordering bullets to match JD priorities, emphasizing matching skills
- 7+ years experience (Jun 2019 to present). NOT 8+.
- No em dashes. Use hyphens or "to" instead.
- Every bullet must have a concrete number or metric
- GCP is primary cloud, mention first
- ATS-friendly: simple formatting, standard section headers, no tables, no columns
- Must fill 3 full pages when formatted

Return JSON with these exact sections:
{
  "summary": "5-6 sentence tailored summary. Must mention the target company/role explicitly. Include key metrics.",
  "skills": {
    "GenAI & LLMs": "...",
    "ML & Deep Learning": "...",
    "LLMs & Models": "...",
    "MLOps & Infrastructure": "...",
    "Cloud": "...",
    "Data & Databases": "...",
    "Programming": "...",
    "Security & Governance": "..."
  },
  "experience": [
    {
      "title": "AI Engineer - GCP & MLOps Platform",
      "company": "National Institute for Aviation Research (NIAR), Wichita State University",
      "location": "Wichita, KS",
      "dates": "January 2025 - Present",
      "bullets": ["7-8 detailed bullets with metrics, tailored to match JD"]
    },
    {
      "title": "AI Engineer - LLM Fine-Tuning & AI Security",
      "company": "Knowmadics",
      "location": "Remote",
      "dates": "July 2024 - January 2025",
      "bullets": ["6-7 detailed bullets"]
    },
    {
      "title": "Senior Data Scientist / ML Engineer",
      "company": "WayCool Technologies",
      "location": "India (Remote)",
      "dates": "January 2021 - January 2024",
      "bullets": ["5-6 detailed bullets"]
    },
    {
      "title": "Data Scientist / Business Intelligence Analyst",
      "company": "Sagacious Research",
      "location": "India",
      "dates": "June 2019 - December 2020",
      "bullets": ["3-4 bullets"]
    }
  ],
  "research": {
    "title": "LLM Output Determinism & Reproducibility",
    "bullets": ["3-4 research bullets"]
  },
  "projects": [
    {"name": "OpenClaw AI", "link": "ganeshmamidipalli.com", "description": "2-3 sentence description with metrics"},
    {"name": "Multi-Agent AI Platform - MCP & A2A Protocol", "description": "1-2 sentences"},
    {"name": "Financial Domain RAG Assistant", "description": "1-2 sentences with metrics"},
    {"name": "WSDM Cup 2024 - LLM Evaluation", "badge": "Top 10% Globally", "description": "1-2 sentences"},
    {"name": "Computer Vision Quality Inspection System", "description": "1 sentence with metric"}
  ],
  "education": [
    {"degree": "M.S. in Business Analytics - Data Science Track", "school": "Wichita State University", "gpa": "3.9/4.0"},
    {"degree": "B.Tech in Electronics & Communication Engineering", "school": "Lovely Professional University, India"}
  ],
  "certifications": [
    "Top 10% Global Finalist - WSDM Cup 2024 (LLM Evaluation Track)",
    "Certified Data Scientist - Dell / NVIDIA GenAI Model Augmentation & Data Engineering Program",
    "Meta Advanced Management Program",
    "$10,000 Garvey Family Scholarship - Academic excellence and research potential",
    "Graduate Research Assistantships - NIAR (Aviation AI) & Koch Global Trading Center (Financial ML)"
  ],
  "publications": [
    "publication line 1",
    "publication line 2"
  ],
  "keywords": ["ATS keywords from JD"]
}

CANDIDATE PROFILE:
${wiki}`,
      messages: [
        {
          role: 'user',
          content: `Generate FULL 3-page tailored resume for:\nCompany: ${company}\nRole: ${role}\nArchetype: ${archetype}\n\nJOB DESCRIPTION:\n${jobDescription?.substring(0, 4000) || 'General AI Engineer role'}`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/```json?\s*([\s\S]*?)```/);
      if (jsonMatch) result = JSON.parse(jsonMatch[1]);
      else return Response.json({ error: 'Failed to parse resume content' }, { status: 500 });
    }

    const companySlug = company.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const filename = `Ganesh_Mamidipalli_AI_Engineer_${companySlug}`;
    const html = buildResumeHTML(result);

    // Store HTML to Vercel Blob if available
    let blobUrl = null;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`resumes/${filename}.html`, html, {
          access: 'public',
          contentType: 'text/html',
        });
        blobUrl = blob.url;
      } catch {}
    }

    return Response.json({
      filename,
      html,
      blobUrl,
      keywords: result.keywords || [],
      summary: result.summary || '',
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (err) {
    return Response.json({ error: `Resume generation failed: ${String(err)}` }, { status: 500 });
  }
}

function buildResumeHTML(d: any): string {
  const esc = (s: string) => s || '';

  const skillsHTML = Object.entries(d.skills || {})
    .map(([cat, val]) => `<div class="skill-row"><span class="skill-cat">${cat}</span><span class="skill-val">${val}</span></div>`)
    .join('');

  const expHTML = (d.experience || []).map((exp: any) => `
    <div class="exp">
      <div class="exp-head">
        <div class="exp-title">${esc(exp.title)} &middot; ${esc(exp.company)} &middot; ${esc(exp.location)}</div>
        <div class="exp-date">${esc(exp.dates)}</div>
      </div>
      <ul>${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>
      ${exp.stack ? `<div class="stack">Stack: ${exp.stack}</div>` : ''}
    </div>`).join('');

  const researchHTML = d.research ? `
    <div class="exp">
      <div class="exp-head">
        <div class="exp-title">${esc(d.research.title)} [Ongoing Research]</div>
      </div>
      <ul>${(d.research.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>
    </div>` : '';

  const projectsHTML = (d.projects || []).map((p: any) => `
    <div class="project">
      <strong>${esc(p.name)}${p.badge ? ` [${p.badge}]` : ''}${p.link ? ` <span class="link">[${p.link}]</span>` : ''}</strong>
      <div>${esc(p.description)}</div>
    </div>`).join('');

  const eduHTML = (d.education || []).map((e: any) => `
    <div class="edu-row">
      <span><strong>${esc(e.degree)}</strong>${e.gpa ? ` &nbsp; GPA: ${e.gpa}` : ''}</span>
      <span>${esc(e.school)}</span>
    </div>`).join('');

  const certsHTML = (d.certifications || []).map((c: string) => `<li>${c}</li>`).join('');
  const pubsHTML = (d.publications || []).map((p: string) => `<li>${p}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ganesh Mamidipalli - Resume</title>
<style>
@page { margin: 0.45in 0.55in; size: letter; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: Calibri, 'Segoe UI', Arial, Helvetica, sans-serif;
  font-size: 10pt;
  line-height: 1.35;
  color: #1a1a1a;
  max-width: 8.5in;
  margin: 0 auto;
}
@media screen {
  body { padding: 0.5in 0.6in; background: white; margin: 16px auto; box-shadow: 0 2px 24px rgba(0,0,0,0.12); }
}
@media print { body { padding: 0; } }

/* Header */
.header { text-align: center; margin-bottom: 8px; }
.name { font-size: 17pt; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; }
.tagline { font-size: 9.5pt; color: #444; margin: 2px 0; }
.contact { font-size: 9pt; color: #555; }

/* Section headers */
h2 {
  font-size: 10.5pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1.5px solid #1a1a1a;
  margin: 10px 0 5px;
  padding-bottom: 2px;
}

/* Skills */
.skill-row { display: flex; margin-bottom: 2px; font-size: 9.5pt; }
.skill-cat { font-weight: bold; min-width: 155px; flex-shrink: 0; }
.skill-val { flex: 1; }

/* Experience */
.exp { margin-bottom: 8px; }
.exp-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; margin-bottom: 2px; }
.exp-title { font-size: 10.5pt; font-weight: bold; }
.exp-date { font-size: 9.5pt; color: #444; white-space: nowrap; }
ul { margin-left: 14px; margin-top: 2px; }
li { margin-bottom: 2px; font-size: 9.8pt; text-align: justify; }
.stack { font-size: 9pt; color: #555; margin-top: 3px; font-style: italic; }

/* Projects */
.project { margin-bottom: 5px; font-size: 9.8pt; }
.project strong { font-size: 10pt; }
.link { color: #555; font-weight: normal; font-size: 9pt; }

/* Education */
.edu-row { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 10pt; }

/* Certs, pubs */
.certs-list, .pubs-list { margin-left: 14px; }
.certs-list li, .pubs-list li { margin-bottom: 2px; font-size: 9.5pt; }

/* Print button - hidden in print */
.print-btn {
  position: fixed; bottom: 20px; right: 20px; z-index: 100;
  background: #06b6d4; color: white; border: none; padding: 12px 24px;
  border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer;
  box-shadow: 0 4px 12px rgba(6,182,212,0.4);
}
.print-btn:hover { background: #0891b2; }
@media print { .print-btn { display: none; } }
</style>
</head><body>

<button class="print-btn" onclick="window.print()">Save as PDF (Ctrl+P)</button>

<div class="header">
  <div class="name">GANESH HEMANTH MAMIDIPALLI</div>
  <div class="tagline">Software Engineer &middot; LLM Systems &middot; Generative AI Infrastructure &middot; Agentic Platforms &middot; MLOps</div>
  <div class="contact">+1 (316) 210-1890 &middot; mganeshhemanth@gmail.com &middot; linkedin.com/in/ganesh-mamidipalli-951a95102 &middot; ganeshmamidipalli.com</div>
</div>

<h2>Professional Summary</h2>
<div style="font-size:10pt;text-align:justify;margin-bottom:4px;">${esc(d.summary)}</div>

<h2>Technical Skills</h2>
<div>${skillsHTML}</div>

<h2>Professional Experience</h2>
${expHTML}

<h2>Active Research</h2>
${researchHTML}

<h2>Personal Projects & Open Source</h2>
${projectsHTML}

<h2>Education</h2>
${eduHTML}

<h2>Certifications & Honors</h2>
<ul class="certs-list">${certsHTML}</ul>

${pubsHTML ? `<h2>Research & Publications</h2><ul class="pubs-list">${pubsHTML}</ul>` : ''}

</body></html>`;
}
