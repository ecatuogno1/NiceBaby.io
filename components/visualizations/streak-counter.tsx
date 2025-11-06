type StreakCounterProps = {
  label: string;
  description: string;
  value: number;
  target?: number;
};

export function StreakCounter({ label, description, value, target }: StreakCounterProps) {
  const statusColor = value >= (target ?? 0) ? 'text-emerald-400' : 'text-sky-400';
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-4xl font-semibold ${statusColor}`}>{value}</span>
        <span className="text-sm text-slate-500">day streak</span>
      </div>
      {target != null && (
        <p className="mt-2 text-xs text-slate-500">Target: {target} days</p>
      )}
      <p className="mt-3 text-sm text-slate-300">{description}</p>
    </div>
  );
}
