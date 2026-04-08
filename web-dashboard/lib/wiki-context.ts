import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');

function safeRead(filePath: string): string {
  // Try project root first (local dev), then data-snapshot (Vercel)
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const snapshotPath = path.join(process.cwd(), 'data-snapshot', filePath);

  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    try {
      return fs.readFileSync(snapshotPath, 'utf-8');
    } catch {
      return '';
    }
  }
}

// Parse wiki into sections by ## headers
function parseSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = content.split(/^## /m);
  for (const part of parts) {
    if (!part.trim()) continue;
    const newline = part.indexOf('\n');
    if (newline === -1) continue;
    const key = part.substring(0, newline).trim().toLowerCase().replace(/[^a-z-]/g, '');
    sections[key] = part.substring(newline).trim();
  }
  return sections;
}

// Lazy-loaded singletons
let _wikiFull: string | null = null;
let _wikiCondensed: string | null = null;
let _scoringSystem: string | null = null;
let _profileContext: string | null = null;

/** Full wiki for Opus (~3600 tokens) */
export function getWikiFull(): string {
  if (_wikiFull === null) {
    _wikiFull = safeRead('ganesh-wiki.md');
  }
  return _wikiFull;
}

/** Condensed wiki for Sonnet screening (~1200 tokens) */
export function getWikiCondensed(): string {
  if (_wikiCondensed === null) {
    const full = getWikiFull();
    const sections = parseSections(full);
    // Only include sections needed for screening
    const keys = ['who', 'skills', 'job-search', 'communication-rules'];
    const parts = keys
      .filter((k) => sections[k])
      .map((k) => `## ${k}\n${sections[k]}`);
    _wikiCondensed = parts.join('\n\n');
  }
  return _wikiCondensed;
}

/** Scoring system from _shared.md */
export function getScoringSystem(): string {
  if (_scoringSystem === null) {
    const shared = safeRead('modes/_shared.md');
    // Extract scoring section
    const match = shared.match(/## Scoring System[\s\S]*?(?=## [A-Z]|$)/);
    _scoringSystem = match ? match[0].trim() : '';
  }
  return _scoringSystem;
}

/** Profile context from _profile.md */
export function getProfileContext(): string {
  if (_profileContext === null) {
    const profile = safeRead('modes/_profile.md');
    // Extract target roles and framing sections
    const match = profile.match(/## Your Target Roles[\s\S]*?## Your Exit Narrative[\s\S]*?(?=## Your Cross|$)/);
    _profileContext = match ? match[0].trim() : '';
  }
  return _profileContext;
}
