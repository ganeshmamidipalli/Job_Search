'use client';

import { useState, useEffect, useCallback } from 'react';

interface AppEntry {
  id: string;
  date: string;
  company: string;
  role: string;
  score: number;
  archetype: string;
  status: 'evaluated' | 'applied' | 'not-applied';
  reason?: string;
  resumeContent?: string;
  resumeFilename?: string;
  reportContent?: string;
  createdAt: number;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasonModal, setReasonModal] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [viewResume, setViewResume] = useState<string | null>(null);

  // Load applications from KV or localStorage
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (data.apps?.length > 0) {
          setApps(data.apps);
        } else if (data.kvError) {
          // Fallback to localStorage
          const local = JSON.parse(localStorage.getItem('job-apps') || '[]');
          setApps(local);
        } else {
          const local = JSON.parse(localStorage.getItem('job-apps') || '[]');
          setApps(local);
        }
      } catch {
        const local = JSON.parse(localStorage.getItem('job-apps') || '[]');
        setApps(local);
      }
      setLoading(false);
    }
    load();
  }, []);

  const updateStatus = useCallback(async (id: string, status: 'applied' | 'not-applied', notAppliedReason?: string) => {
    // Try KV first
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, reason: notAppliedReason }),
      });
      if (res.ok) {
        setApps((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status, reason: notAppliedReason || a.reason } : a
          )
        );
        return;
      }
    } catch {}

    // Fallback: localStorage
    setApps((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, status, reason: notAppliedReason || a.reason } : a
      );
      localStorage.setItem('job-apps', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const downloadResume = (app: AppEntry) => {
    if (!app.resumeContent) return;
    try {
      const data = JSON.parse(app.resumeContent);
      const content = `PROFESSIONAL SUMMARY\n${data.summary || ''}\n\nKEY EXPERIENCE\n${(data.bullets || []).map((b: string) => `- ${b}`).join('\n')}\n\nKEYWORDS: ${(data.keywords || []).join(', ')}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.resumeFilename || 'Ganesh_Mamidipalli_AI_Engineer'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const openResume = (app: AppEntry) => {
    setViewResume(app.id === viewResume ? null : app.id);
  };

  const scoreColor = (score: number) => {
    if (score >= 4.0) return 'text-emerald-400';
    if (score >= 3.5) return 'text-amber-400';
    return 'text-red-400';
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'not-applied':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Applications</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {apps.length} tracked &middot;
          {apps.filter((a) => a.status === 'applied').length} applied &middot;
          {apps.filter((a) => a.status === 'not-applied').length} skipped
        </p>
      </div>

      {apps.length === 0 ? (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">No applications yet</p>
          <p className="text-gray-500 text-sm">Score a JD in the Evaluate tab to start tracking</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const resumeData = app.resumeContent ? (() => { try { return JSON.parse(app.resumeContent!); } catch { return null; } })() : null;

            return (
              <div key={app.id} className="bg-surface rounded-xl border border-surface-light/30 overflow-hidden">
                {/* Main row */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-200 truncate">{app.company}</h3>
                        <span className={`text-lg font-bold ${scoreColor(app.score)}`}>{app.score}/5</span>
                      </div>
                      <p className="text-xs text-gray-400">{app.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{app.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${statusBadge(app.status)}`}>
                      {app.status === 'applied' ? 'Applied' : app.status === 'not-applied' ? 'Skipped' : 'Evaluated'}
                    </span>
                  </div>

                  {/* Reason for not applying */}
                  {app.status === 'not-applied' && app.reason && (
                    <p className="text-xs text-red-400/70 mt-2 italic">Reason: {app.reason}</p>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {/* Resume: open / download */}
                    {app.resumeContent && (
                      <>
                        <button
                          onClick={() => openResume(app)}
                          className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs hover:bg-accent/20 transition-colors"
                        >
                          {viewResume === app.id ? 'Close Resume' : 'View Resume'}
                        </button>
                        <button
                          onClick={() => downloadResume(app)}
                          className="px-3 py-1.5 bg-surface-light text-gray-300 rounded-lg text-xs hover:bg-surface-light/80 transition-colors"
                        >
                          Download
                        </button>
                      </>
                    )}

                    {/* Applied / Not Applied */}
                    {app.status === 'evaluated' && (
                      <>
                        <button
                          onClick={() => updateStatus(app.id, 'applied')}
                          className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-600/30 transition-colors"
                        >
                          Applied
                        </button>
                        <button
                          onClick={() => { setReasonModal(app.id); setReason(''); }}
                          className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-colors"
                        >
                          Not Applied
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded resume view */}
                {viewResume === app.id && resumeData && (
                  <div className="border-t border-surface-light/30 p-4 bg-background/50 space-y-3">
                    {resumeData.summary && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 mb-1">Tailored Summary</h4>
                        <p className="text-sm text-gray-200">{resumeData.summary}</p>
                      </div>
                    )}
                    {resumeData.bullets?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 mb-1">Key Bullets</h4>
                        <ul className="space-y-1">
                          {resumeData.bullets.map((b: string, i: number) => (
                            <li key={i} className="text-xs text-gray-300">- {b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeData.keywords?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 mb-1">ATS Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {resumeData.keywords.map((k: string, i: number) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-full">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Not Applied reason modal */}
      {reasonModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-surface-light/30 p-6 w-full max-w-md">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Why not applying?</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Entry level, no visa sponsorship, wrong location..."
              className="w-full h-24 bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  if (reason.trim()) {
                    updateStatus(reasonModal, 'not-applied', reason.trim());
                  }
                  setReasonModal(null);
                }}
                disabled={!reason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 min-h-[44px]"
              >
                Skip this role
              </button>
              <button
                onClick={() => setReasonModal(null)}
                className="px-4 py-2.5 bg-surface-light text-gray-300 rounded-lg text-sm min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
