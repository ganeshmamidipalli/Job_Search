import { getReports, getReport } from '@/lib/data';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ReportPage({ params }: { params: { id: string } }) {
  const report = getReport(params.id);

  if (!report) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-300 mb-4">Report Not Found</h1>
        <p className="text-gray-500 mb-6">Report #{params.id} does not exist.</p>
        <Link href="/applications" className="text-accent hover:text-accent-light">
          &larr; Back to Applications
        </Link>
      </div>
    );
  }

  // Parse score number for color
  const scoreNum = parseFloat(report.score.replace('/5', ''));
  let scoreColor = 'text-red-400';
  if (scoreNum >= 4.0) scoreColor = 'text-emerald-400';
  else if (scoreNum >= 3.5) scoreColor = 'text-amber-400';

  return (
    <div>
      <Link href="/applications" className="text-sm text-accent hover:text-accent-light mb-6 inline-block">
        &larr; Back to Applications
      </Link>

      {/* Report header */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-6 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 mb-1">{report.company}</h1>
            <p className="text-gray-300">{report.role}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              {report.date && <span>Date: {report.date}</span>}
              {report.location && <span>Location: {report.location}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${scoreColor}`}>{report.score}</div>
            <div className="text-xs text-gray-500 mt-1">Fit Score</div>
          </div>
        </div>
        {report.url && (
          <div className="mt-4 pt-4 border-t border-surface-light/30">
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:text-accent-light break-all">
              {report.url}
            </a>
          </div>
        )}
      </div>

      {/* Report content */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-8 prose max-w-none">
        <ReactMarkdown>{report.content}</ReactMarkdown>
      </div>
    </div>
  );
}
