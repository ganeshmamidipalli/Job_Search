'use client';

import { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

type Phase = 'idle' | 'screening' | 'evaluating' | 'generating' | 'done' | 'error';

interface Screening {
  score: number;
  reason: string;
  archetype: string;
}

interface TokenUsage {
  screening: { input: number; output: number } | null;
  full: { input: number; output: number } | null;
}

export default function EvaluatePage() {
  const [jd, setJd] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [screening, setScreening] = useState<Screening | null>(null);
  const [report, setReport] = useState('');
  const [tokens, setTokens] = useState<TokenUsage | null>(null);
  const [error, setError] = useState('');
  const [resumeKit, setResumeKit] = useState<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  const evaluate = useCallback(async () => {
    if (!jd.trim() || jd.trim().length < 50) {
      setError('Paste the full job description (at least 50 characters)');
      return;
    }

    setPhase('screening');
    setScreening(null);
    setReport('');
    setTokens(null);
    setError('');
    setResumeKit(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Evaluation failed');
        setPhase('error');
        return;
      }

      // Check if streaming (SSE) or JSON response
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // Streaming response (score > 3.5, full eval)
        setPhase('evaluating');
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

            switch (data.type) {
              case 'screening':
                setScreening({ score: data.score, reason: data.reason, archetype: data.archetype });
                break;
              case 'text':
                setReport((prev) => prev + data.content);
                break;
              case 'done':
                setTokens(data.tokenUsage);
                setPhase('done');
                break;
              case 'error':
                setError(data.message);
                setPhase('error');
                break;
            }
          }
        }

        if (phase !== 'error') setPhase('done');
      } else {
        // JSON response (score <= 3.5, screening only)
        const data = await res.json();
        setScreening({ score: data.score, reason: data.reason, archetype: data.archetype });
        setTokens(data.tokenUsage);
        setPhase('done');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(String(err));
      setPhase('error');
    }
  }, [jd]);

  const generateResume = useCallback(async () => {
    if (!screening) return;
    setPhase('generating');
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: 'Target Company',
          role: screening.archetype,
          archetype: screening.archetype,
          jobDescription: jd,
        }),
      });
      const data = await res.json();
      setResumeKit(data);
      setPhase('done');
    } catch {
      setPhase('done');
    }
  }, [screening, jd]);

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

  const totalTokens = tokens
    ? (tokens.screening?.input || 0) +
      (tokens.screening?.output || 0) +
      (tokens.full?.input || 0) +
      (tokens.full?.output || 0)
    : 0;

  const estimatedCost = totalTokens > 0 ? (totalTokens * 0.00002).toFixed(3) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Evaluate Job</h1>
        <p className="text-gray-400 mt-1 text-sm">Paste a JD. Sonnet screens it. Opus evaluates if it fits.</p>
      </div>

      {/* Input */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-6">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-40 md:h-48 bg-background border border-surface-light/30 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50 transition-colors"
          disabled={phase === 'screening' || phase === 'evaluating'}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">
            {jd.length > 0 ? `${jd.length} chars` : 'Min 50 characters'}
          </span>
          <button
            onClick={evaluate}
            disabled={phase === 'screening' || phase === 'evaluating' || jd.trim().length < 50}
            className="px-6 py-3 bg-accent text-background font-semibold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-light active:scale-95 transition-all min-h-[44px]"
          >
            {phase === 'screening'
              ? 'Screening...'
              : phase === 'evaluating'
              ? 'Evaluating...'
              : 'Evaluate'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Screening result */}
      {screening && (
        <div className={`rounded-xl border p-4 md:p-6 mb-6 ${scoreBg(screening.score)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Screening Score</span>
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
              <span className="text-xs text-red-400">Below threshold. Opus eval skipped to save tokens.</span>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator for evaluation */}
      {phase === 'evaluating' && !report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-8 mb-6 text-center">
          <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Opus is running full A-F evaluation...</p>
        </div>
      )}

      {/* Streaming report */}
      {report && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Full Evaluation</h2>
          <div className="prose max-w-none text-sm">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Actions */}
      {phase === 'done' && screening && screening.score > 3.5 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={generateResume}
            disabled={!!resumeKit}
            className="px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg text-sm hover:bg-emerald-500 active:scale-95 transition-all min-h-[44px] disabled:opacity-50"
          >
            {resumeKit ? 'Resume Kit Ready' : 'Generate Resume Kit'}
          </button>
          <button
            onClick={() => {
              const companySlug = (screening?.archetype || 'company').replace(/[^a-zA-Z0-9]/g, '_');
              const blob = new Blob([report], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Ganesh_Mamidipalli_AI_Engineer_${companySlug}_eval.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-3 bg-surface-light text-gray-200 font-medium rounded-lg text-sm hover:bg-surface-light/80 active:scale-95 transition-all min-h-[44px]"
          >
            Download Report
          </button>
        </div>
      )}

      {/* Resume kit */}
      {resumeKit && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 md:p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Resume Kit</h2>
            {resumeKit.filename && (
              <span className="text-xs text-gray-500 font-mono">{resumeKit.filename}</span>
            )}
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
                  <li key={i} className="text-sm text-gray-300 bg-background rounded-lg p-2">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resumeKit.keywords?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">ATS Keywords</h3>
              <div className="flex flex-wrap gap-1">
                {resumeKit.keywords.map((k: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token usage */}
      {tokens && (
        <div className="text-xs text-gray-500 text-center space-x-4">
          {tokens.screening && (
            <span>Screening: {tokens.screening.input + tokens.screening.output} tokens</span>
          )}
          {tokens.full && (
            <span>Full eval: {tokens.full.input + tokens.full.output} tokens</span>
          )}
          {estimatedCost && <span>Est. cost: ${estimatedCost}</span>}
        </div>
      )}
    </div>
  );
}
