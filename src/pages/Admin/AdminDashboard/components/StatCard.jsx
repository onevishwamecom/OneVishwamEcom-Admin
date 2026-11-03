import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon, iconClass, valueClass, to }) {
  const displayValue = typeof value === 'number'
    ? new Intl.NumberFormat('en-IN').format(value)
    : (value ?? 0);

  if (to) {
    return (
      <Link
        to={`/admin/listings?activeTab=${to}`}
        className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4 cursor-pointer hover:no-underline"
      >
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${iconClass}`}>
          <i className={`fa-solid ${icon} text-lg`} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className={`text-3xl font-extrabold tabular-nums ${valueClass}`}>{displayValue}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-0.5">{label}</p>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4 cursor-pointer"
    >
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${iconClass}`}>
        <i className={`fa-solid ${icon} text-lg`} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className={`text-3xl font-extrabold tabular-nums ${valueClass}`}>{displayValue}</p>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}