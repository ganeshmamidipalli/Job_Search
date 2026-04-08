'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

type Phase = 'idle' | 'screening' | 'generating' | 'full-eval' | 'done' | 'error';
interface Screening { score: number; reason: string; archetype: string; }

// Always use localStorage -- reliable, works everywhere, no KV dependency
function saveApp(entry: any) {
  const apps = JSON.parse(localStorage.getItem('job-apps') || '[]');
  // Check duplicate
  const dup = apps.find((a: any) => a.company === entry.company && a.role === entry.role);
  if (dup) { Object.assign(dup, entry); }
  else { apps.unshift({ id: `app-${Date.now()}`, createdAt: Date.now(), ...entry }); }
  localStorage.setItem('job-apps', JSON.stringify(apps));
  // Also try KV in background
  fetch('/api/applications', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  }).catch(() => {});
}

function updateAppStatus(company: string, role: string, status: string, jdLink?: string) {
  const apps = JSON.parse(localStorage.getItem('job-apps') || '[]');
  const match = apps.find((a: any) => a.company === company && a.role === role);
  if (match) {
    match.status = status;
    if (jdLink) match.jdLink = jdLink;
    localStorage.setItem('job-apps', JSON.stringify(apps));
  }
}

export default function EvaluatePage() {
  const [jd, setJd] = useState('');
  const [jdLink, setJdLink] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [screening, setScreening] = useState<Screening | null>(null);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [appliedMsg, setAppliedMsg] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  function extractCompany(text: string): string {
    // Try common patterns from job postings
    const lines = text.split('\n').filter(l => l.trim());
    // Pattern: "Company Name • Location" or "Company Name | Location"
    for (const line of lines.slice(0, 5)) {
      const m = line.match(/^([A-Za-z][A-Za-z0-9\s&.,]+?)\s*[•·|]\s/);
      if (m && m[1].trim().length > 1 && m[1].trim().length < 50) return m[1].trim();
    }
    // Pattern: "at Company"
    const atMatch = text.match(/(?:at|@)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s*[•·|,]|\n)/);
    if (atMatch) return atMatch[1].trim().substring(0, 50);
    return 'Company';
  }

  function extractRole(text: string): string {
    const m = text.match(/(?:Entry.?Level|Senior|Staff|Lead|Principal|Jr\.?|Junior)?\s*([A-Z][A-Za-z\s/&]+?(?:Engineer|Developer|Scientist|Architect|Manager|Analyst))/);
    return m?.[0]?.trim()?.substring(0, 60) || 'AI Engineer';
  }

  const evaluate = useCallback(async () => {
    if (jd.trim().length < 50) { setError('Paste the full JD (min 50 chars)'); return; }
    setPhase('screening'); setScreening(null); setReport(''); setError(''); setResumeData(null); setTotalCost(0); setAppliedMsg('');

    const detectedCompany = extractCompany(jd);
    const detectedRole = extractRole(jd);
    setCompany(detectedCompany);
    setRole(detectedRole);

    try {
      // Step 1: Score
      const res = await fetch('/api/evaluate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, scoreOnly: true }),
      });
      if (!res.ok) { setError((await res.json()).error || 'Failed'); setPhase('error'); return; }
      const data = await res.json();
      setScreening({ score: data.score, reason: data.reason, archetype: data.archetype });
      let cost = ((data.tokenUsage?.screening?.input || 0) + (data.tokenUsage?.screening?.output || 0)) * 0.000003;

      // Step 2: Resume if good fit
      if (data.score > 3.5) {
        setPhase('generating');
        const resumeRes = await fetch('/api/generate-pdf', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company: detectedCompany, role: detectedRole, archetype: data.archetype, jobDescription: jd }),
        });
        const rData = await resumeRes.json();
        if (!rData.error) {
          setResumeData(rData);
          cost += ((rData.tokenUsage?.input || 0) + (rData.tokenUsage?.output || 0)) * 0.000003;

          // Save to tracker (localStorage first, KV in background)
          saveApp({
            date: new Date().toISOString().split('T')[0],
            company: detectedCompany,
            role: detectedRole,
            score: data.score,
            archetype: data.archetype,
            status: 'evaluated',
            jdLink: jdLink || '',
            resumeHtml: rData.html || '',
            resumeFilename: rData.filename || '',
            blobUrl: rData.blobUrl || '',
          });
        }
      }
      setTotalCost(cost);
      setPhase('done');
    } catch (err: any) { setError(String(err)); setPhase('error'); }
  }, [jd, jdLink]);

  const runFullReport = useCallback(async () => {
    if (!screening) return;
    setPhase('full-eval'); setReport('');
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, scoreOnly: false }),
      });
      if (!res.ok) { setPhase('done'); return; }
      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n'); buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const d = JSON.parse(line.substring(6));
          if (d.type === 'text') setReport((p) => p + d.content);
        }
      }
      setPhase('done');
    } catch { setPhase('done'); }
  }, [jd, screening]);

  function openResume() {
    if (!resumeData?.html) return;
    const w = window.open('', '_blank');
    if (w) { w.document.write(resumeData.html); w.document.close(); }
  }

  function downloadResume() {
    if (!resumeData?.html) return;
    const b = new Blob([resumeData.html], { type: 'text/html' });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = u;
    a.download = `${resumeData.filename || `Ganesh_Mamidipalli_AI_Engineer_${company.replace(/[^a-zA-Z0-9]/g, '_')}`}.html`;
    a.click();
    URL.revokeObjectURL(u);
  }

  const sc = (s: number) => s >= 4.0 ? 'text-emerald-400' : s >= 3.5 ? 'text-amber-400' : 'text-red-400';
  const sb = (s: number) => s >= 4.0 ? 'bg-emerald-500/20 border-emerald-500/30' : s >= 3.5 ? 'bg-amber-500/20 border-amber-500/30' : 'bg-red-500/20 border-red-500/30';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Evaluate Job</h1>
        <p className="text-gray-400 mt-1 text-sm">Score → 3-page resume → Track</p>
      </div>

      {/* Input */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-4 mb-4">
        <input type="url" value={jdLink} onChange={(e) => setJdLink(e.target.value)}
          placeholder="Job URL (optional, saved for tracking)"
          className="w-full bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50 mb-2" />
        <textarea value={jd} onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description..."
          className="w-full h-36 md:h-44 bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50"
          disabled={phase === 'screening' || phase === 'generating' || phase === 'full-eval'} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{jd.length > 0 ? `${jd.length} chars` : 'Min 50'}</span>
          <button onClick={evaluate}
            disabled={phase === 'screening' || phase === 'generating' || phase === 'full-eval' || jd.trim().length < 50}
            className="px-5 py-3 bg-accent text-background font-bold rounded-lg text-sm disabled:opacity-40 hover:bg-accent-light active:scale-95 transition-all min-h-[48px] min-w-[120px]">
            {phase === 'screening' ? 'Scoring...' : phase === 'generating' ? 'Building resume...' : 'Score It'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4"><p className="text-red-400 text-sm">{error}</p></div>}

      {/* Score */}
      {screening && (
        <div className={`rounded-xl border p-4 mb-4 ${sb(screening.score)}`}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="text-sm font-medium text-gray-300">Fit Score</span>
              {company !== 'Company' && <span className="text-xs text-gray-500 ml-2">{company} - {role}</span>}
            </div>
            <span className={`text-3xl font-bold ${sc(screening.score)}`}>{screening.score}/5</span>
          </div>
          <p className="text-sm text-gray-300">{screening.reason}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 bg-surface-light/30 rounded-full text-gray-400">{screening.archetype}</span>
            {screening.score <= 3.5 && <span className="text-xs text-red-400">Low fit. Resume skipped.</span>}
            {screening.score > 3.5 && phase === 'generating' && <span className="text-xs text-accent animate-pulse">Building 3-page resume...</span>}
          </div>
        </div>
      )}

      {/* Resume ready */}
      {resumeData?.html && (
        <div className="bg-surface rounded-xl border border-emerald-500/30 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-emerald-400">Resume Ready</h2>
              <p className="text-xs text-gray-500 font-mono">{resumeData.filename}.html</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button onClick={openResume}
              className="py-3 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-500 active:scale-95 transition-all min-h-[48px]">
              Open Resume
            </button>
            <button onClick={downloadResume}
              className="py-3 bg-surface-light text-gray-200 font-medium rounded-lg text-sm hover:bg-surface-light/80 active:scale-95 transition-all min-h-[48px]">
              Download
            </button>
          </div>

          {resumeData.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {resumeData.keywords.slice(0, 15).map((k: string, i: number) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-full">{k}</span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">Open → Ctrl+P / Cmd+P → Save as PDF</p>

          {/* I Will Apply */}
          {!appliedMsg && (
            <button onClick={() => {
              updateAppStatus(company, role, 'applied', jdLink);
              setAppliedMsg('Marked as Applied! Check Applications tab.');
            }}
              className="w-full mt-3 py-3 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-500 active:scale-95 transition-all min-h-[48px]">
              I Will Apply for This Role
            </button>
          )}
          {appliedMsg && <p className="text-xs text-emerald-400 mt-3 text-center font-medium">{appliedMsg}</p>}
        </div>
      )}

      {/* Full report - optional */}
      {phase === 'done' && screening && screening.score > 3.5 && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Need detailed A-F evaluation?</p>
              <p className="text-xs text-gray-500">Uses Opus (~$0.10)</p>
            </div>
            <button onClick={runFullReport} className="px-4 py-2 bg-surface-light text-gray-200 rounded-lg text-sm hover:bg-surface-light/80 active:scale-95">Full Report</button>
          </div>
        </div>
      )}

      {phase === 'full-eval' && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-8 mb-4 text-center">
          <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-gray-400 text-sm">Running full evaluation...</p>
        </div>
      )}

      {report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-200">Full Evaluation</h2>
            <button onClick={() => {
              const b = new Blob([report], { type: 'text/markdown' });
              const u = URL.createObjectURL(b);
              const a = document.createElement('a'); a.href = u;
              a.download = `${resumeData?.filename || `Ganesh_Mamidipalli_AI_Engineer_${company.replace(/[^a-zA-Z0-9]/g, '_')}`}_eval.md`; a.click();
            }} className="px-3 py-1 bg-surface-light text-gray-300 rounded-lg text-xs">Download</button>
          </div>
          <div className="prose max-w-none text-sm"><ReactMarkdown>{report}</ReactMarkdown></div>
        </div>
      )}

      {totalCost > 0 && <p className="text-xs text-gray-500 text-center">Cost: ~${totalCost.toFixed(4)}</p>}
    </div>
  );
}
