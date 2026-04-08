'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

type Phase = 'idle' | 'screening' | 'generating' | 'full-eval' | 'done' | 'error';

interface Screening { score: number; reason: string; archetype: string; }
interface TokenUsage { screening: { input: number; output: number } | null; full: { input: number; output: number } | null; resume: { input: number; output: number } | null; }

export default function EvaluatePage() {
  const [jd, setJd] = useState('');
  const [jdLink, setJdLink] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [screening, setScreening] = useState<Screening | null>(null);
  const [report, setReport] = useState('');
  const [tokens, setTokens] = useState<TokenUsage>({ screening: null, full: null, resume: null });
  const [error, setError] = useState('');
  const [resumeKit, setResumeKit] = useState<any>(null);

  function extractCompany(text: string): string {
    const patterns = [
      /^(.+?)\s*[•·|]\s/m,
      /(?:at|@)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s*[•·|,]|\n)/,
      /^([A-Z][A-Za-z0-9\s&.]+?)(?:\s+is\s|\s+are\s)/m,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m && m[1].trim().length > 1 && m[1].trim().length < 50) return m[1].trim();
    }
    return 'Company';
  }

  function extractRole(text: string): string {
    const patterns = [
      /(?:Entry Level|Senior|Staff|Lead|Principal|Jr\.?|Junior)?\s*([A-Z][A-Za-z\s/&]+?Engineer|[A-Z][A-Za-z\s/&]+?Developer|[A-Z][A-Za-z\s/&]+?Scientist|[A-Z][A-Za-z\s/&]+?Architect)/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return m[0].trim().substring(0, 60);
    }
    return 'AI Engineer';
  }

  // Step 1: Score only
  const evaluate = useCallback(async () => {
    if (!jd.trim() || jd.trim().length < 50) {
      setError('Paste the full job description (at least 50 characters)');
      return;
    }

    setPhase('screening');
    setScreening(null);
    setReport('');
    setTokens({ screening: null, full: null, resume: null });
    setError('');
    setResumeKit(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, scoreOnly: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Evaluation failed');
        setPhase('error');
        return;
      }

      const data = await res.json();
      setScreening({ score: data.score, reason: data.reason, archetype: data.archetype });
      setTokens((prev) => ({ ...prev, screening: data.tokenUsage?.screening || null }));

      // Auto-generate resume if score > 3.5
      if (data.score > 3.5) {
        setPhase('generating');
        const company = extractCompany(jd);
        const role = extractRole(jd);
        try {
          const resumeRes = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company, role, archetype: data.archetype, jobDescription: jd }),
          });
          const resumeData = await resumeRes.json();
          if (resumeData.error) throw new Error(resumeData.error);
          setResumeKit(resumeData);
          setTokens((prev) => ({ ...prev, resume: resumeData.tokenUsage || null }));

          // Save to tracker
          saveToTracker({
            date: new Date().toISOString().split('T')[0],
            company,
            role,
            score: data.score,
            archetype: data.archetype,
            status: 'evaluated',
            jdLink: jdLink || '',
            resumeHtml: resumeData.html || '',
            resumeFilename: resumeData.filename || '',
            resumeContent: JSON.stringify(resumeData),
          });
        } catch {
          // Resume failed, still save the score
          saveToTracker({
            date: new Date().toISOString().split('T')[0],
            company,
            role,
            score: data.score,
            archetype: data.archetype,
            status: 'evaluated',
            jdLink: jdLink || '',
            resumeHtml: '',
            resumeFilename: '',
            resumeContent: '',
          });
        }
      }
      setPhase('done');
    } catch (err: any) {
      setError(String(err));
      setPhase('error');
    }
  }, [jd, jdLink]);

  function saveToTracker(entry: any) {
    try {
      fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {
        // KV fallback: localStorage
        const apps = JSON.parse(localStorage.getItem('job-apps') || '[]');
        apps.unshift({ id: `app-${Date.now()}`, createdAt: Date.now(), ...entry });
        localStorage.setItem('job-apps', JSON.stringify(apps));
      });
    } catch {
      const apps = JSON.parse(localStorage.getItem('job-apps') || '[]');
      apps.unshift({ id: `app-${Date.now()}`, createdAt: Date.now(), ...entry });
      localStorage.setItem('job-apps', JSON.stringify(apps));
    }
  }

  // Open resume in new tab for print-to-PDF
  function openResume() {
    if (!resumeKit?.html) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(resumeKit.html);
      win.document.close();
    }
  }

  // Full report (optional, Opus)
  const runFullReport = useCallback(async () => {
    if (!screening) return;
    setPhase('full-eval');
    setReport('');
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, scoreOnly: false }),
      });
      if (!res.ok) { setError('Full evaluation failed'); setPhase('done'); return; }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      if (!reader) throw new Error('No response body');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = JSON.parse(line.substring(6));
          if (data.type === 'text') setReport((prev) => prev + data.content);
          else if (data.type === 'done') setTokens((prev) => ({ ...prev, full: data.tokenUsage?.full || null }));
        }
      }
      setPhase('done');
    } catch { setPhase('done'); }
  }, [jd, screening]);

  const scoreColor = (s: number) => s >= 4.0 ? 'text-emerald-400' : s >= 3.5 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = (s: number) => s >= 4.0 ? 'bg-emerald-500/20 border-emerald-500/30' : s >= 3.5 ? 'bg-amber-500/20 border-amber-500/30' : 'bg-red-500/20 border-red-500/30';
  const totalTokens = (tokens.screening?.input || 0) + (tokens.screening?.output || 0) + (tokens.full?.input || 0) + (tokens.full?.output || 0) + (tokens.resume?.input || 0) + (tokens.resume?.output || 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Evaluate Job</h1>
        <p className="text-gray-400 mt-1 text-sm">Score → Resume (2-3 pages) → Full report (optional)</p>
      </div>

      {/* Input */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-6">
        {/* JD Link (optional) */}
        <input
          type="url"
          value={jdLink}
          onChange={(e) => setJdLink(e.target.value)}
          placeholder="Job posting URL (optional, saved for tracking)"
          className="w-full bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors mb-3"
        />
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-40 md:h-48 bg-background border border-surface-light/30 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50 transition-colors"
          disabled={phase === 'screening' || phase === 'full-eval'}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">{jd.length > 0 ? `${jd.length} chars` : 'Min 50 characters'}</span>
          <button
            onClick={evaluate}
            disabled={phase === 'screening' || phase === 'generating' || phase === 'full-eval' || jd.trim().length < 50}
            className="px-6 py-3 bg-accent text-background font-semibold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-light active:scale-95 transition-all min-h-[44px]"
          >
            {phase === 'screening' ? 'Scoring...' : phase === 'generating' ? 'Building resume...' : 'Score It'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Score */}
      {screening && (
        <div className={`rounded-xl border p-4 md:p-6 mb-6 ${scoreBg(screening.score)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Fit Score</span>
            <span className={`text-3xl font-bold ${scoreColor(screening.score)}`}>{screening.score}/5</span>
          </div>
          <p className="text-sm text-gray-300">{screening.reason}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-surface-light/30 rounded-full text-gray-400">{screening.archetype}</span>
            {screening.score <= 3.5 && <span className="text-xs text-red-400">Low fit. Resume not generated.</span>}
            {screening.score > 3.5 && phase === 'generating' && <span className="text-xs text-accent animate-pulse">Generating 2-3 page resume...</span>}
          </div>
        </div>
      )}

      {/* Resume -- the main deliverable */}
      {resumeKit && resumeKit.html && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Resume Ready</h2>
              <span className="text-xs text-gray-500 font-mono">{resumeKit.filename}.pdf</span>
            </div>
          </div>

          {/* Action buttons -- big, clear */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              onClick={openResume}
              className="px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg text-sm hover:bg-emerald-500 active:scale-95 transition-all min-h-[48px]"
            >
              Open Resume (Print to PDF)
            </button>
            <button
              onClick={() => {
                const blob = new Blob([resumeKit.html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resumeKit.filename}.html`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-3 bg-surface-light text-gray-200 font-medium rounded-lg text-sm hover:bg-surface-light/80 active:scale-95 transition-all min-h-[48px]"
            >
              Download HTML
            </button>
          </div>

          {/* ATS Keywords */}
          {resumeKit.keywords?.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-400 mb-2">ATS Keywords matched</h3>
              <div className="flex flex-wrap gap-1">
                {resumeKit.keywords.map((k: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">{k}</span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-3">Click "Open Resume" → Ctrl+P (or Cmd+P) → Save as PDF. The page is formatted for A4/Letter print.</p>
        </div>
      )}

      {/* Full report -- optional */}
      {phase === 'done' && screening && screening.score > 3.5 && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Need full A-F evaluation?</p>
              <p className="text-xs text-gray-500">Opus. Detailed. ~$0.10</p>
            </div>
            <button onClick={runFullReport} className="px-4 py-2 bg-surface-light text-gray-200 font-medium rounded-lg text-sm hover:bg-surface-light/80 active:scale-95 transition-all">
              Full Report
            </button>
          </div>
        </div>
      )}

      {phase === 'full-eval' && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-8 mb-6 text-center">
          <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Running full A-F evaluation...</p>
        </div>
      )}

      {report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Full Evaluation</h2>
            <button
              onClick={() => {
                const slug = extractCompany(jd).replace(/[^a-zA-Z0-9]/g, '_');
                const blob = new Blob([report], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Ganesh_Mamidipalli_AI_Engineer_${slug}_eval.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 bg-surface-light text-gray-300 rounded-lg text-xs hover:bg-surface-light/80"
            >
              Download
            </button>
          </div>
          <div className="prose max-w-none text-sm"><ReactMarkdown>{report}</ReactMarkdown></div>
        </div>
      )}

      {totalTokens > 0 && (
        <div className="text-xs text-gray-500 text-center space-x-3">
          {tokens.screening && <span>Score: {tokens.screening.input + tokens.screening.output}t</span>}
          {tokens.resume && <span>Resume: {tokens.resume.input + tokens.resume.output}t</span>}
          {tokens.full && <span>Report: {tokens.full.input + tokens.full.output}t</span>}
          <span>~${(totalTokens * 0.00002).toFixed(3)}</span>
        </div>
      )}
    </div>
  );
}
