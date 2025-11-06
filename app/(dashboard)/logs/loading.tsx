export default function LogsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl bg-slate-800/60" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/40" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/40" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/40" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/40" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/40" />
      </div>
    </div>
  );
}
