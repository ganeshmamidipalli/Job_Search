'use client';

import { useState, useEffect, useCallback } from 'react';

interface AppEntry {
  id: string; date: string; company: string; role: string; score: number;
  archetype: string; status: 'evaluated' | 'applied' | 'not-applied';
  reason?: string; jdLink?: string; resumeHtml?: string; resumeFilename?: string;
  resumeContent?: string; createdAt: number;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasonModal, setReasonModal] = useState<string | null>(null);
  const [linkModal, setLinkModal] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (data.apps?.length > 0) { setApps(data.apps); }
        else {
          const local = JSON.parse(localStorage.getItem('job-apps') || '[]');
          setApps(local);
        }
      } catch {
        setApps(JSON.parse(localStorage.getItem('job-apps') || '[]'));
      }
      setLoading(false);
    }
    load();
  }, []);

  const updateApp = useCallback(async (id: string, updates: any) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setApps((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a));
        return;
      }
    } catch {}
    // localStorage fallback
    setApps((prev) => {
      const updated = prev.map((a) => a.id === id ? { ...a, ...updates } : a);
      localStorage.setItem('job-apps', JSON.stringify(updated));
      return updated;
    });
  }, []);

  function openResume(app: AppEntry) {
    if (!app.resumeHtml) return;
    const win = window.open('', '_blank');
    if (win) { win.document.write(app.resumeHtml); win.document.close(); }
  }

  function downloadResume(app: AppEntry) {
    if (!app.resumeHtml) return;
    const blob = new Blob([app.resumeHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.resumeFilename || 'Ganesh_Mamidipalli_AI_Engineer'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const scoreColor = (s: number) => s >= 4.0 ? 'text-emerald-400' : s >= 3.5 ? 'text-amber-400' : 'text-red-400';
  const statusStyle = (s: string) => s === 'applied' ? 'bg-emerald-500/20 text-emerald-400' : s === 'not-applied' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400';

  const applied = apps.filter((a) => a.status === 'applied').length;
  const skipped = apps.filter((a) => a.status === 'not-applied').length;
  const pending = apps.filter((a) => a.status === 'evaluated').length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Applications</h1>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-gray-400">{apps.length} total</span>
          <span className="text-emerald-400">{applied} applied</span>
          <span className="text-amber-400">{pending} pending</span>
          <span className="text-red-400">{skipped} skipped</span>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">No applications yet</p>
          <p className="text-gray-500 text-sm">Score a JD in the Evaluate tab to start</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="bg-surface rounded-xl border border-surface-light/30 p-4">
              {/* Header: company, role, score, status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-200 truncate">{app.company}</h3>
                    <span className={`text-sm font-bold ${scoreColor(app.score)}`}>{app.score}/5</span>
                  </div>
                  <p className="text-xs text-gray-400">{app.role}</p>
                  <p className="text-xs text-gray-500">{app.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyle(app.status)}`}>
                  {app.status === 'applied' ? 'Applied' : app.status === 'not-applied' ? 'Skipped' : 'Pending'}
                </span>
              </div>

              {/* JD Link */}
              {app.jdLink ? (
                <a href={app.jdLink} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-light truncate block mb-2">
                  {app.jdLink}
                </a>
              ) : (
                <button
                  onClick={() => { setLinkModal(app.id); setInputVal(''); }}
                  className="text-xs text-gray-500 hover:text-accent mb-2"
                >
                  + Add JD link
                </button>
              )}

              {/* Reason if skipped */}
              {app.status === 'not-applied' && app.reason && (
                <p className="text-xs text-red-400/70 italic mb-2">Reason: {app.reason}</p>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Resume actions */}
                {app.resumeHtml ? (
                  <>
                    <button onClick={() => openResume(app)} className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs hover:bg-accent/20">
                      Open Resume
                    </button>
                    <button onClick={() => downloadResume(app)} className="px-3 py-1.5 bg-surface-light text-gray-300 rounded-lg text-xs hover:bg-surface-light/80">
                      Download
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">No resume</span>
                )}

                {/* Status buttons */}
                {app.status === 'evaluated' && (
                  <>
                    <button onClick={() => updateApp(app.id, { status: 'applied' })} className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-600/30 ml-auto">
                      Applied
                    </button>
                    <button onClick={() => { setReasonModal(app.id); setInputVal(''); }} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30">
                      Not Applied
                    </button>
                  </>
                )}

                {/* Revisit link for applied */}
                {app.status === 'applied' && app.jdLink && (
                  <a href={app.jdLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface-light text-gray-300 rounded-lg text-xs hover:bg-surface-light/80 ml-auto">
                    Revisit JD
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Not Applied reason modal */}
      {reasonModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-surface-light/30 p-6 w-full max-w-md">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Why not applying?</h3>
            <textarea value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              placeholder="Entry level, no visa sponsorship, wrong stack..."
              className="w-full h-24 bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50" autoFocus />
            <div className="flex gap-2 mt-3">
              <button onClick={() => { if (inputVal.trim()) updateApp(reasonModal, { status: 'not-applied', reason: inputVal.trim() }); setReasonModal(null); }}
                disabled={!inputVal.trim()} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 min-h-[44px]">
                Skip
              </button>
              <button onClick={() => setReasonModal(null)} className="px-4 py-2.5 bg-surface-light text-gray-300 rounded-lg text-sm min-h-[44px]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add JD link modal */}
      {linkModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-surface-light/30 p-6 w-full max-w-md">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Add job posting link</h3>
            <input type="url" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              placeholder="https://..."
              className="w-full bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50" autoFocus />
            <div className="flex gap-2 mt-3">
              <button onClick={() => { if (inputVal.trim()) updateApp(linkModal, { jdLink: inputVal.trim() }); setLinkModal(null); }}
                disabled={!inputVal.trim()} className="flex-1 px-4 py-2.5 bg-accent text-background rounded-lg text-sm font-medium disabled:opacity-40 min-h-[44px]">
                Save
              </button>
              <button onClick={() => setLinkModal(null)} className="px-4 py-2.5 bg-surface-light text-gray-300 rounded-lg text-sm min-h-[44px]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
