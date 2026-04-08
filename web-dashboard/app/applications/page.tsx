import Link from 'next/link';
import { getApplications } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import ScoreBadge from '@/components/ScoreBadge';

export default function ApplicationsPage() {
  const applications = getApplications();

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Applications</h1>
        <p className="text-gray-400 mt-1 text-sm">{applications.length} total applications tracked</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-12 text-center text-gray-500">
          <p className="text-lg mb-2">No applications yet</p>
          <p className="text-sm">Run an evaluation to get started</p>
        </div>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="md:hidden space-y-3">
            {applications.map((app) => (
              <div
                key={app.num}
                className="bg-surface rounded-xl border border-surface-light/30 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-200 truncate">{app.company}</h3>
                    <p className="text-xs text-gray-400 truncate">{app.role}</p>
                  </div>
                  <ScoreBadge score={app.score} raw={app.scoreRaw} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-gray-500">{app.date}</span>
                  {app.pdf === '✅' && <span className="text-xs">✅ PDF</span>}
                  {app.reportId && (
                    <Link
                      href={`/reports/${app.reportId}`}
                      className="text-xs text-accent hover:text-accent-light"
                    >
                      Report #{app.reportId}
                    </Link>
                  )}
                </div>
                {app.notes && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{app.notes}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden md:block bg-surface rounded-xl border border-surface-light/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-surface-light/20">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">PDF</th>
                    <th className="px-4 py-3">Report</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-light/20">
                  {applications.map((app) => (
                    <tr key={app.num} className="hover:bg-surface-light/10 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-400 font-mono">{app.num}</td>
                      <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">{app.date}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-200">{app.company}</td>
                      <td className="px-4 py-4 text-sm text-gray-300 max-w-xs">
                        <span className="line-clamp-2">{app.role}</span>
                      </td>
                      <td className="px-4 py-4">
                        <ScoreBadge score={app.score} raw={app.scoreRaw} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-center">{app.pdf}</td>
                      <td className="px-4 py-4 text-sm">
                        {app.reportId ? (
                          <Link
                            href={`/reports/${app.reportId}`}
                            className="text-accent hover:text-accent-light underline"
                          >
                            #{app.reportId}
                          </Link>
                        ) : (
                          <span className="text-gray-500">--</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400 max-w-xs">
                        <span className="line-clamp-2">{app.notes}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
