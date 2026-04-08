'use client';

import { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

type Phase = 'idle' | 'screening' | 'generating' | 'full-eval' | 'done' | 'error';

interface Screening {
  score: number;
  reason: string;
  archetype: string;
}

interface TokenUsage {
  screening: { input: number; output: number } | null;
  full: { input: number; output: number } | null;
  resume: { input: number; output: number } | null;
}

export default function EvaluatePage() {
  const [jd, setJd] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [screening, setScreening] = useState<Screening | null>(null);
  const [report, setReport] = useState('');
  const [tokens, setTokens] = useState<TokenUsage>({ screening: null, full: null, resume: null });
  const [error, setError] = useState('');
  const [resumeKit, setResumeKit] = useState<any>(null);

  // Step 1: Score only (Sonnet, ~$0.005)
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
        try {
          const resumeRes = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company: extractCompany(jd),
              role: data.archetype,
              archetype: data.archetype,
              jobDescription: jd,
            }),
          });
          const resumeData = await resumeRes.json();
          setResumeKit(resumeData);
          setTokens((prev) => ({
            ...prev,
            resume: resumeData.tokenUsage || null,
          }));

          // Auto-save to applications tracker
          const company = extractCompany(jd);
          try {
            await fetch('/api/applications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: new Date().toISOString().split('T')[0],
                company,
                role: data.archetype,
                score: data.score,
                archetype: data.archetype,
                status: 'evaluated',
                resumeContent: JSON.stringify(resumeData),
                resumeFilename: resumeData.filename,
              }),
            });
          } catch {
            // KV not configured -- save to localStorage fallback
            const apps = JSON.parse(localStorage.getItem('job-apps') || '[]');
            apps.unshift({
              id: `app-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              company,
              role: data.archetype,
              score: data.score,
              archetype: data.archetype,
              status: 'evaluated',
              resumeContent: JSON.stringify(resumeData),
              resumeFilename: resumeData.filename,
              createdAt: Date.now(),
            });
            localStorage.setItem('job-apps', JSON.stringify(apps));
          }
        } catch {
          // Resume gen failed, but score is still valid
        }
      }

      setPhase('done');
    } catch (err: any) {
      setError(String(err));
      setPhase('error');
    }
  }, [jd]);

  // Step 3 (optional): Full A-F report (Opus, ~$0.10)
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

      if (!res.ok) {
        setError('Full evaluation failed');
        setPhase('done');
        return;
      }

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

          if (data.type === 'text') {
            setReport((prev) => prev + data.content);
          } else if (data.type === 'done') {
            setTokens((prev) => ({ ...prev, full: data.tokenUsage?.full || null }));
          } else if (data.type === 'screening') {
            // Skip, we already have it
          }
        }
      }
      setPhase('done');
    } catch {
      setPhase('done');
    }
  }, [jd, screening]);

  // Try to extract company name from JD text
  function extractCompany(text: string): string {
    // Look for patterns like "Company • Location" or "at Company"
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

  const scoreColor = (score: number) => {
    if (score >= 4.0) return 'text-emerald-400';
    if (score >= 3.5) return 'text-amber-400';
    return 'text-red-400';
  };

  const scoreBg = (score: number) => {
    if (score >= 4.0) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 3.5) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const totalTokens =
    (tokens.screening?.input || 0) + (tokens.screening?.output || 0) +
    (tokens.full?.input || 0) + (tokens.full?.output || 0) +
    (tokens.resume?.input || 0) + (tokens.resume?.output || 0);
  const estimatedCost = totalTokens > 0 ? (totalTokens * 0.00002).toFixed(3) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Evaluate Job</h1>
        <p className="text-gray-400 mt-1 text-sm">Score → Resume → Full report (only if you need it)</p>
      </div>

      {/* Input */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-6">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-40 md:h-48 bg-background border border-surface-light/30 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50 transition-colors"
          disabled={phase === 'screening' || phase === 'full-eval'}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">
            {jd.length > 0 ? `${jd.length} chars` : 'Min 50 characters'}
          </span>
          <button
            onClick={evaluate}
            disabled={phase === 'screening' || phase === 'generating' || phase === 'full-eval' || jd.trim().length < 50}
            className="px-6 py-3 bg-accent text-background font-semibold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-light active:scale-95 transition-all min-h-[44px]"
          >
            {phase === 'screening' ? 'Scoring...' : phase === 'generating' ? 'Building resume...' : 'Score It'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Score result */}
      {screening && (
        <div className={`rounded-xl border p-4 md:p-6 mb-6 ${scoreBg(screening.score)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Fit Score</span>
            <span className={`text-3xl font-bold ${scoreColor(screening.score)}`}>
              {screening.score}/5
            </span>
          </div>
          <p className="text-sm text-gray-300">{screening.reason}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-surface-light/30 rounded-full text-gray-400">
              {screening.archetype}
            </span>
            {screening.score <= 3.5 && (
              <span className="text-xs text-red-400">Low fit. Resume not generated.</span>
            )}
            {screening.score > 3.5 && phase === 'generating' && (
              <span className="text-xs text-accent animate-pulse">Generating resume...</span>
            )}
          </div>
        </div>
      )}

      {/* Resume kit -- shows immediately after scoring if score > 3.5 */}
      {resumeKit && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Resume Ready</h2>
            <span className="text-xs text-gray-500 font-mono">{resumeKit.filename}</span>
          </div>

          {resumeKit.summary && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Tailored Summary</h3>
              <p className="text-sm text-gray-200 bg-background rounded-lg p-3">{resumeKit.summary}</p>
              <button
                onClick={() => navigator.clipboard.writeText(resumeKit.summary)}
                className="text-xs text-accent mt-1 hover:text-accent-light"
              >
                Copy
              </button>
            </div>
          )}

          {resumeKit.bullets?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Key Bullets</h3>
              <ul className="space-y-1">
                {resumeKit.bullets.map((b: string, i: number) => (
                  <li key={i} className="text-sm text-gray-300 bg-background rounded-lg p-2">{b}</li>
                ))}
              </ul>
              <button
                onClick={() => navigator.clipboard.writeText(resumeKit.bullets.join('\n'))}
                className="text-xs text-accent mt-1 hover:text-accent-light"
              >
                Copy all bullets
              </button>
            </div>
          )}

          {resumeKit.keywords?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">ATS Keywords</h3>
              <div className="flex flex-wrap gap-1">
                {resumeKit.keywords.map((k: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Download resume as text */}
          <button
            onClick={() => {
              const content = `PROFESSIONAL SUMMARY\n${resumeKit.summary}\n\nKEY EXPERIENCE\n${(resumeKit.bullets || []).map((b: string) => `- ${b}`).join('\n')}\n\nKEYWORDS: ${(resumeKit.keywords || []).join(', ')}`;
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${resumeKit.filename || 'Ganesh_Mamidipalli_AI_Engineer'}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg text-sm hover:bg-emerald-500 active:scale-95 transition-all min-h-[44px]"
          >
            Download Resume ({resumeKit.filename}.txt)
          </button>
        </div>
      )}

      {/* Full report button -- only if user wants it */}
      {phase === 'done' && screening && screening.score > 3.5 && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Want the full A-F evaluation?</p>
              <p className="text-xs text-gray-500">Uses Opus. More detailed but costs ~$0.10</p>
            </div>
            <button
              onClick={runFullReport}
              className="px-4 py-2 bg-surface-light text-gray-200 font-medium rounded-lg text-sm hover:bg-surface-light/80 active:scale-95 transition-all"
            >
              Full Report
            </button>
          </div>
        </div>
      )}

      {/* Loading full eval */}
      {phase === 'full-eval' && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-8 mb-6 text-center">
          <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Running full A-F evaluation...</p>
        </div>
      )}

      {/* Full report (only when requested) */}
      {report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Full Evaluation</h2>
            <button
              onClick={() => {
                const company = extractCompany(jd);
                const slug = company.replace(/[^a-zA-Z0-9]/g, '_');
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
          <div className="prose max-w-none text-sm">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Token usage */}
      {totalTokens > 0 && (
        <div className="text-xs text-gray-500 text-center space-x-3">
          {tokens.screening && <span>Score: {tokens.screening.input + tokens.screening.output}t</span>}
          {tokens.resume && <span>Resume: {tokens.resume.input + tokens.resume.output}t</span>}
          {tokens.full && <span>Report: {tokens.full.input + tokens.full.output}t</span>}
          {estimatedCost && <span>Total: ~${estimatedCost}</span>}
        </div>
      )}
    </div>
  );
}
