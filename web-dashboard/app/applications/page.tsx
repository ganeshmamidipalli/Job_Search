'use client';

import { useState, useEffect, useCallback } from 'react';

interface AppEntry {
  id: string; date: string; company: string; role: string; score: number;
  archetype: string; status: 'evaluated' | 'applied' | 'not-applied';
  reason?: string; jdLink?: string; resumeHtml?: string; resumeFilename?: string;
  blobUrl?: string; createdAt: number;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ id: string; type: 'reason' | 'link' | 'applied-link' } | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ company: '', role: '', jdLink: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (data.apps?.length > 0) setApps(data.apps);
        else setApps(JSON.parse(localStorage.getItem('job-apps') || '[]'));
      } catch { setApps(JSON.parse(localStorage.getItem('job-apps') || '[]')); }
      setLoading(false);
    })();
  }, []);

  const updateApp = useCallback(async (id: string, updates: any) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) { setApps((p) => p.map((a) => a.id === id ? { ...a, ...updates } : a)); return; }
    } catch {}
    setApps((p) => { const u = p.map((a) => a.id === id ? { ...a, ...updates } : a); localStorage.setItem('job-apps', JSON.stringify(u)); return u; });
  }, []);

  function openResume(app: AppEntry) {
    if (app.blobUrl) { window.open(app.blobUrl, '_blank'); return; }
    if (!app.resumeHtml) return;
    const w = window.open('', '_blank');
    if (w) { w.document.write(app.resumeHtml); w.document.close(); }
  }

  const sc = (s: number) => s >= 4.0 ? 'text-emerald-400' : s >= 3.5 ? 'text-amber-400' : 'text-red-400';
  const ss = (s: string) => s === 'applied' ? 'bg-emerald-500/20 text-emerald-400' : s === 'not-applied' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400';

  const applied = apps.filter((a) => a.status === 'applied').length;
  const pending = apps.filter((a) => a.status === 'evaluated').length;
  const skipped = apps.filter((a) => a.status === 'not-applied').length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Applications</h1>
        <div className="flex gap-3 mt-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-surface-light text-gray-300">{apps.length} total</span>
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{applied} applied</span>
          <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">{pending} pending</span>
          <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400">{skipped} skipped</span>
        </div>
      </div>

      {/* Add manually button */}
      <button onClick={() => setShowAddForm(!showAddForm)}
        className="w-full mb-3 py-2.5 border border-dashed border-surface-light/50 text-gray-400 rounded-xl text-sm hover:border-accent/50 hover:text-accent transition-colors">
        {showAddForm ? 'Cancel' : '+ Add application manually'}
      </button>

      {showAddForm && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-4 mb-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input value={newEntry.company} onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })}
              placeholder="Company *" className="bg-background border border-surface-light/30 rounded-lg p-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50" />
            <input value={newEntry.role} onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
              placeholder="Role / Position *" className="bg-background border border-surface-light/30 rounded-lg p-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50" />
          </div>
          <input value={newEntry.jdLink} onChange={(e) => setNewEntry({ ...newEntry, jdLink: e.target.value })}
            placeholder="Job posting URL" type="url" className="w-full bg-background border border-surface-light/30 rounded-lg p-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50" />
          <input value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            type="date" className="w-full bg-background border border-surface-light/30 rounded-lg p-2.5 text-sm text-gray-200 focus:outline-none focus:border-accent/50" />
          <button
            disabled={!newEntry.company.trim() || !newEntry.role.trim()}
            onClick={async () => {
              const entry = {
                id: `app-${Date.now()}`,
                date: newEntry.date,
                company: newEntry.company.trim(),
                role: newEntry.role.trim(),
                score: 0,
                archetype: 'Manual',
                status: 'applied' as const,
                jdLink: newEntry.jdLink.trim() || '',
                createdAt: Date.now(),
              };
              try {
                await fetch('/api/applications', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(entry),
                });
              } catch {}
              // Always save to localStorage too
              const local = JSON.parse(localStorage.getItem('job-apps') || '[]');
              local.unshift(entry);
              localStorage.setItem('job-apps', JSON.stringify(local));
              setApps((p) => [entry, ...p]);
              setNewEntry({ company: '', role: '', jdLink: '', date: new Date().toISOString().split('T')[0] });
              setShowAddForm(false);
            }}
            className="w-full py-2.5 bg-accent text-background font-bold rounded-lg text-sm disabled:opacity-40 hover:bg-accent-light active:scale-95 transition-all min-h-[44px]">
            Add to Applications
          </button>
        </div>
      )}

      {apps.length === 0 ? (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-12 text-center">
          <p className="text-gray-400 text-lg mb-1">No applications yet</p>
          <p className="text-gray-500 text-sm">Score a JD to start tracking</p>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map((app) => (
            <div key={app.id} className="bg-surface rounded-xl border border-surface-light/30 p-3.5">
              {/* Row 1: company + score + status */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-200 truncate">{app.company}</h3>
                    <span className={`text-sm font-bold ${sc(app.score)}`}>{app.score}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{app.role}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-gray-500">{app.date}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ss(app.status)}`}>
                    {app.status === 'applied' ? 'Applied' : app.status === 'not-applied' ? 'Skipped' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* JD Link */}
              {app.jdLink ? (
                <a href={app.jdLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent hover:text-accent-light truncate block mb-1.5">{app.jdLink}</a>
              ) : (
                <button onClick={() => { setModal({ id: app.id, type: 'link' }); setInputVal(''); }}
                  className="text-[11px] text-gray-500 hover:text-accent mb-1.5">+ Add job link</button>
              )}

              {app.status === 'not-applied' && app.reason && (
                <p className="text-[11px] text-red-400/60 italic mb-1.5">Skipped: {app.reason}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(app.resumeHtml || app.blobUrl) && (
                  <button onClick={() => openResume(app)}
                    className="px-2.5 py-1.5 bg-emerald-600/20 text-emerald-400 rounded-md text-[11px] font-medium hover:bg-emerald-600/30 active:scale-95">
                    Open Resume
                  </button>
                )}

                {app.jdLink && (
                  <a href={app.jdLink} target="_blank" rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-accent/10 text-accent rounded-md text-[11px] font-medium hover:bg-accent/20">
                    View JD
                  </a>
                )}

                {app.status === 'evaluated' && (
                  <>
                    <button onClick={() => { setModal({ id: app.id, type: 'applied-link' }); setInputVal(app.jdLink || ''); }}
                      className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-md text-[11px] font-medium hover:bg-emerald-500 active:scale-95 ml-auto">
                      Mark Applied
                    </button>
                    <button onClick={() => { setModal({ id: app.id, type: 'reason' }); setInputVal(''); }}
                      className="px-2.5 py-1.5 bg-red-600/20 text-red-400 rounded-md text-[11px] font-medium hover:bg-red-600/30 active:scale-95">
                      Skip
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-surface-light/30 p-5 w-full max-w-md">
            <h3 className="text-sm font-bold text-gray-200 mb-3">
              {modal.type === 'reason' ? 'Why skipping?' : modal.type === 'applied-link' ? 'Mark as Applied' : 'Add job posting link'}
            </h3>

            {modal.type === 'applied-link' && (
              <p className="text-xs text-gray-400 mb-2">Paste the application link so you can revisit later:</p>
            )}

            {modal.type === 'reason' ? (
              <textarea value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                placeholder="Entry level, no visa, wrong stack..."
                className="w-full h-20 bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent/50" autoFocus />
            ) : (
              <input type="url" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                placeholder="https://..."
                className="w-full bg-background border border-surface-light/30 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50" autoFocus />
            )}

            <div className="flex gap-2 mt-3">
              <button onClick={() => {
                if (modal.type === 'reason' && inputVal.trim()) {
                  updateApp(modal.id, { status: 'not-applied', reason: inputVal.trim() });
                } else if (modal.type === 'link' && inputVal.trim()) {
                  updateApp(modal.id, { jdLink: inputVal.trim() });
                } else if (modal.type === 'applied-link') {
                  updateApp(modal.id, { status: 'applied', jdLink: inputVal.trim() || undefined });
                }
                setModal(null);
              }}
                disabled={modal.type === 'reason' && !inputVal.trim()}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium min-h-[44px] disabled:opacity-40 ${
                  modal.type === 'reason' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                {modal.type === 'reason' ? 'Skip' : modal.type === 'applied-link' ? 'Mark Applied' : 'Save'}
              </button>
              <button onClick={() => setModal(null)}
                className="px-4 py-2.5 bg-surface-light text-gray-300 rounded-lg text-sm min-h-[44px]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
