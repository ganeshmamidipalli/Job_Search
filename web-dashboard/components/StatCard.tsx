interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export default function StatCard({ label, value, subtext, color = 'accent' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    accent: 'text-accent',
    green: 'text-emerald-400',
    yellow: 'text-amber-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="bg-surface rounded-xl border border-surface-light/30 p-6">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color] || 'text-accent'}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}
