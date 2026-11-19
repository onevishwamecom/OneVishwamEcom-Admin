import React from 'react';

/**
 * Overview metrics bar above the listings table.
 * Summarizes Total Listings, Pending Review, Approved & Live, and Cancelled/Rejected.
 * Clicking a metric card switches the active status filter tab.
 */
export default function ListingsMetricsStrip({ counts = {}, activeTab = 'all', onSelectTab }) {
  const metrics = [
    {
      id: 'all',
      label: 'Total Listings',
      subtitle: 'All catalog records',
      count: counts.all ?? 0,
      icon: 'fa-layer-group',
      iconBg: 'bg-blue-50 text-brand-blue border border-blue-100',
      activeBorder: 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/20',
      activePill: 'bg-brand-blue text-white border-brand-blue',
    },
    {
      id: 'pending',
      label: 'Pending Review',
      subtitle: 'Requires action',
      count: counts.pending ?? 0,
      icon: 'fa-hourglass-half',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-400/20 bg-amber-50/20',
      activePill: 'bg-amber-500 text-white border-amber-500',
      hasPulse: (counts.pending || 0) > 0,
    },
    {
      id: 'approved',
      label: 'Approved & Live',
      subtitle: 'Visible to shoppers',
      count: counts.approved ?? 0,
      icon: 'fa-circle-check',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-400/20 bg-emerald-50/20',
      activePill: 'bg-emerald-600 text-white border-emerald-600',
    },
    {
      id: 'cancelled',
      label: 'Cancelled / Rejected',
      subtitle: 'Declined or inactive',
      count: counts.cancelled ?? 0,
      icon: 'fa-ban',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-400/20 bg-rose-50/20',
      activePill: 'bg-rose-600 text-white border-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
      {metrics.map((m) => {
        const isActive = activeTab === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectTab?.(m.id)}
            className={`group text-left p-3.5 sm:p-4 rounded-2xl bg-white border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
              isActive
                ? `${m.activeBorder} shadow-sm`
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 group-hover:text-slate-800 transition-colors flex items-center gap-1.5">
                {m.label}
                {m.hasPulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
              </span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${m.iconBg}`}
              >
                <i className={`fa-solid ${m.icon} text-xs sm:text-sm`} aria-hidden="true" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums tracking-tight">
                {m.count.toLocaleString()}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                  isActive
                    ? m.activePill
                    : 'bg-slate-50 text-slate-400 border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-600'
                }`}
              >
                {isActive ? 'Active' : 'Filter'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
