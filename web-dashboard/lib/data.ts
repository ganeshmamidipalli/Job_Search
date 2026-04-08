import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const SNAPSHOT_ROOT = path.resolve(process.cwd(), 'data-snapshot');

export interface Application {
  num: number;
  date: string;
  company: string;
  role: string;
  score: number;
  scoreRaw: string;
  status: string;
  pdf: string;
  reportId: string;
  reportPath: string;
  notes: string;
}

export interface Report {
  id: string;
  filename: string;
  company: string;
  role: string;
  date: string;
  score: string;
  url: string;
  location: string;
  content: string;
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github: string;
  headline: string;
  exitStory: string;
  targetRoles: string[];
  superpowers: string[];
  proofPoints: { name: string; metric: string }[];
  compensation: { target: string; minimum: string };
  cvContent: string;
  skills: Record<string, string>;
}

function safeReadFile(relativePath: string): string | null {
  // Try project root first (local dev), then data-snapshot (Vercel)
  for (const root of [PROJECT_ROOT, SNAPSHOT_ROOT]) {
    try {
      return fs.readFileSync(path.join(root, relativePath), 'utf-8');
    } catch {
      continue;
    }
  }
  return null;
}

function safeReadFileAbs(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export function getApplications(): Application[] {
  const content = safeReadFile('data/applications.md');
  if (!content) return [];

  const lines = content.split('\n');
  const applications: Application[] = [];

  for (const line of lines) {
    // Match table rows that start with | followed by a number
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 9) continue;

    const num = parseInt(cells[0], 10);
    if (isNaN(num)) continue; // skip header and separator rows

    // Extract report ID from markdown link like [001](reports/001-smithrx-2026-04-07.md)
    const reportMatch = cells[7].match(/\[(\d+)\]\((.*?)\)/);
    const reportId = reportMatch ? reportMatch[1] : '';
    const reportPath = reportMatch ? reportMatch[2] : '';

    // Parse score like "3.8/5"
    const scoreMatch = cells[4].match(/([\d.]+)\/5/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

    applications.push({
      num,
      date: cells[1],
      company: cells[2],
      role: cells[3],
      score,
      scoreRaw: cells[4],
      status: cells[5],
      pdf: cells[6],
      reportId,
      reportPath,
      notes: cells[8],
    });
  }

  return applications;
}

export function getReports(): Report[] {
  // Try both roots for reports directory
  let reportsDir = path.join(PROJECT_ROOT, 'reports');
  try { fs.readdirSync(reportsDir); } catch { reportsDir = path.join(SNAPSHOT_ROOT, 'reports'); }
  try {
    const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith('.md'));
    return files.map((filename) => {
      const content = fs.readFileSync(path.join(reportsDir, filename), 'utf-8');
      const id = filename.match(/^(\d+)/)?.[1] || '';

      // Parse header fields
      const getField = (name: string): string => {
        const match = content.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*(.+)`));
        return match ? match[1].trim() : '';
      };

      return {
        id,
        filename,
        company: getField('Company'),
        role: getField('Role'),
        date: getField('Date'),
        score: getField('Score'),
        url: getField('URL'),
        location: getField('Location'),
        content,
      };
    });
  } catch {
    return [];
  }
}

export function getReport(id: string): Report | null {
  const reports = getReports();
  return reports.find((r) => r.id === id) || null;
}

export function getProfile(): Profile {
  const profileContent = safeReadFile('config/profile.yml');
  const cvContent = safeReadFile('cv.md') || '';

  const emptyProfile: Profile = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    headline: '',
    exitStory: '',
    targetRoles: [],
    superpowers: [],
    proofPoints: [],
    compensation: { target: '', minimum: '' },
    cvContent,
    skills: {},
  };

  if (!profileContent) return emptyProfile;

  try {
    const data = yaml.load(profileContent) as any;
    if (!data) return emptyProfile;

    const candidate = data.candidate || {};
    const narrative = data.narrative || {};
    const comp = data.compensation || {};
    const roles = data.target_roles?.primary || [];

    // Parse skills from CV
    const skills: Record<string, string> = {};
    const skillSections = cvContent.match(/###\s+(.+)\n([^#]+)/g);
    if (skillSections) {
      for (const section of skillSections) {
        const match = section.match(/###\s+(.+)\n([\s\S]+)/);
        if (match) {
          skills[match[1].trim()] = match[2].trim();
        }
      }
    }

    return {
      fullName: candidate.full_name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      location: candidate.location || '',
      linkedin: candidate.linkedin || '',
      portfolio: candidate.portfolio_url || '',
      github: candidate.github || '',
      headline: narrative.headline || '',
      exitStory: narrative.exit_story || '',
      targetRoles: roles,
      superpowers: narrative.superpowers || [],
      proofPoints: (narrative.proof_points || []).map((p: any) => ({
        name: p.name || '',
        metric: p.hero_metric || '',
      })),
      compensation: {
        target: comp.target_range || '',
        minimum: comp.minimum || '',
      },
      cvContent,
      skills,
    };
  } catch {
    return emptyProfile;
  }
}
