export type ActivityBarChartDatum = {
  label: string;
  value: number;
};

type ActivityBarChartProps = {
  title: string;
  data: ActivityBarChartDatum[];
  valueUnit?: string;
  emphasis?: 'muted' | 'default';
};

export function ActivityBarChart({ title, data, valueUnit = 'min', emphasis = 'default' }: ActivityBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barClass = emphasis === 'muted' ? 'bg-sky-500/70' : 'bg-sky-400';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
        <span className="text-xs text-slate-500">Last {data.length} days</span>
      </div>
      <div className="space-y-3">
        {data.map((item) => {
          const width = `${Math.max((item.value / max) * 100, 8)}%`;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">{item.label}</span>
                <span>
                  {item.value} {valueUnit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className={`h-2 rounded-full transition-all ${barClass}`} style={{ width }} />
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-slate-500">No activity logged for this range yet.</p>
        )}
      </div>
    </div>
  );
}
