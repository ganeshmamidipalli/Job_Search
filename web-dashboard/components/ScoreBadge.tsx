interface ScoreBadgeProps {
  score: number;
  raw: string;
}

export default function ScoreBadge({ score, raw }: ScoreBadgeProps) {
  let colorClass = 'bg-red-500/20 text-red-400 border-red-500/30';
  if (score >= 4.0) {
    colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  } else if (score >= 3.5) {
    colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {raw}
    </span>
  );
}
