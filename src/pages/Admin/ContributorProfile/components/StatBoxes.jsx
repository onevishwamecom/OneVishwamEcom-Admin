const BOXES = [
  { key: 'totalListings', label: 'Total', cls: 'text-brand-blue', bg: 'bg-brand-blue/10' },
  { key: 'pendingListings', label: 'Pending', cls: 'text-amber-700', bg: 'bg-amber-50' },
  { key: 'approvedListings', label: 'Approved', cls: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'cancelledListings', label: 'Cancelled', cls: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function StatBoxes({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {BOXES.map((b) => (
        <div key={b.key} className={`${b.bg} rounded-2xl p-4 text-center`}>
          <p className={`text-2xl font-extrabold tabular-nums ${b.cls}`}>{stats?.[b.key] ?? 0}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mt-0.5">{b.label}</p>
        </div>
      ))}
    </div>
  );
}