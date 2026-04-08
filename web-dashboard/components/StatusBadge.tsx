interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  Applied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Interview: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Evaluated: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  Discarded: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  SKIP: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Offer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Responded: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classes = statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {status}
    </span>
  );
}
