import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon, gradient = 'from-brand-blue to-blue-600', iconClass, to }) {
  const displayValue = typeof value === 'number'
    ? new Intl.NumberFormat('en-IN').format(value)
    : (value ?? 0);

  const activeGradient = gradient || iconClass || 'from-brand-blue to-blue-600';

  const cardContent = (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between h-full">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${activeGradient}`} />

      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${activeGradient} flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-110 transition-transform duration-200`}>
          <i className={`fa-solid ${icon} text-sm`} aria-hidden="true" />
        </div>
      </div>

      {/* Bottom: Big bold number */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
          {displayValue}
        </span>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={`/admin/listings?activeTab=${to}`}
        className="block cursor-pointer hover:no-underline h-full"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
