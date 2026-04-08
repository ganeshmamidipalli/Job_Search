import Link from 'next/link';
import { getApplications } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import ScoreBadge from '@/components/ScoreBadge';

export default function ApplicationsPage() {
  const applications = getApplications();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Applications</h1>
        <p className="text-gray-400 mt-1">{applications.length} total applications tracked</p>
      </div>

      <div className="bg-surface rounded-xl border border-surface-light/30 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No applications yet</p>
            <p className="text-sm">Run an evaluation to get started</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
