import Link from 'next/link';
import { getApplications } from '@/lib/data';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import ScoreBadge from '@/components/ScoreBadge';

export default function DashboardPage() {
  const applications = getApplications();

  const totalApps = applications.length;
  const avgScore = totalApps > 0
    ? (applications.reduce((sum, a) => sum + a.score, 0) / totalApps).toFixed(1)
    : '0.0';

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  for (const app of applications) {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  }

  // Score distribution
  const scoreBuckets = [
    { label: '4.0+', min: 4.0, max: 5.1, color: 'bg-emerald-500' },
    { label: '3.5-3.9', min: 3.5, max: 4.0, color: 'bg-amber-500' },
    { label: '3.0-3.4', min: 3.0, max: 3.5, color: 'bg-orange-500' },
    { label: '<3.0', min: 0, max: 3.0, color: 'bg-red-500' },
  ];

  const scoreDistribution = scoreBuckets.map((bucket) => ({
    ...bucket,
    count: applications.filter((a) => a.score >= bucket.min && a.score < bucket.max).length,
  }));

  const maxBucketCount = Math.max(...scoreDistribution.map((d) => d.count), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-400 mt-1">Job search pipeline overview</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Applications" value={totalApps} color="accent" />
        <StatCard label="Average Score" value={`${avgScore}/5`} color={parseFloat(avgScore) >= 4 ? 'green' : parseFloat(avgScore) >= 3.5 ? 'yellow' : 'red'} />
        <StatCard
          label="Top Status"
          value={Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          subtext={Object.entries(statusCounts).map(([k, v]) => `${k}: ${v}`).join(', ') || 'No data'}
          color="blue"
        />
        <StatCard
          label="High Scores (4.0+)"
          value={applications.filter((a) => a.score >= 4.0).length}
          subtext={`of ${totalApps} total`}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent applications */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-surface-light/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-light/30 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Recent Applications</h2>
            <Link href="/applications" className="text-sm text-accent hover:text-accent-light">
              View all &rarr;
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg mb-2">No applications yet</p>
              <p className="text-sm">Evaluated jobs will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-light/20">
                  {applications.slice(0, 10).map((app) => (
                    <tr key={app.num} className="hover:bg-surface-light/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-200">{app.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{app.role}</td>
                      <td className="px-6 py-4"><ScoreBadge score={app.score} raw={app.scoreRaw} /></td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4 text-sm text-gray-400">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Score distribution */}
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Score Distribution</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-4">
              {scoreDistribution.map((bucket) => (
                <div key={bucket.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{bucket.label}</span>
                    <span className="text-gray-400">{bucket.count}</span>
                  </div>
                  <div className="w-full bg-surface-light/30 rounded-full h-3">
                    <div
                      className={`${bucket.color} h-3 rounded-full transition-all`}
                      style={{ width: `${(bucket.count / maxBucketCount) * 100}%`, minWidth: bucket.count > 0 ? '12px' : '0' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status breakdown */}
          <h3 className="text-sm font-semibold text-gray-300 mt-8 mb-3">Status Breakdown</h3>
          {Object.keys(statusCounts).length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-sm text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
