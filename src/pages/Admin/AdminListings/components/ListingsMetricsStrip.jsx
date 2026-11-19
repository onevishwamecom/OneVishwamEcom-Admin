import React from 'react';

/**
 * Unified Status & Metrics Filter Bar for Admin Listings.
 * Serves as both the high-level metrics summary and the interactive status filter tabs.
 * Eliminates duplicate controls by combining status tabs and metric counters into one cohesive bar.
 */
export default function ListingsMetricsStrip({ counts = {}, activeTab = 'all', onSelectTab }) {
  const metrics = [
    {
      id: 'all',
      label: 'All Listings',
      count: counts.all ?? 0,
      icon: 'fa-layer-group',
      iconBg: 'bg-blue-50 text-brand-blue border border-blue-100',
      activeBorder: 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/20',
      activePill: 'bg-brand-blue text-white border-brand-blue',
    },
    {
      id: 'pending',
      label: 'Pending Review',
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
      count: counts.approved ?? 0,
      icon: 'fa-circle-check',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-400/20 bg-emerald-50/20',
      activePill: 'bg-emerald-600 text-white border-emerald-600',
    },
    {
      id: 'changes-required',
      label: 'Changes Required',
      count: counts['changes-required'] ?? counts['changes_required'] ?? counts['changes_requested'] ?? 0,
      icon: 'fa-pen-to-square',
      iconBg: 'bg-violet-50 text-violet-600 border border-violet-100',
      activeBorder: 'border-violet-500 ring-2 ring-violet-400/20 bg-violet-50/20',
      activePill: 'bg-violet-600 text-white border-violet-600',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: counts.cancelled ?? 0,
      icon: 'fa-ban',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-400/20 bg-rose-50/20',
      activePill: 'bg-rose-600 text-white border-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-3.5">
      {metrics.map((m) => {
        const isActive = activeTab === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectTab?.(m.id)}
            className={`group text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5 ${
              isActive
                ? `${m.activeBorder} shadow-2xs`
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors flex items-center gap-1 truncate">
                {m.label}
                {m.hasPulse && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
              </span>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${m.iconBg}`}
              >
                <i className={`fa-solid ${m.icon} text-[10px]`} aria-hidden="true" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums tracking-tight">
                {m.count.toLocaleString()}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-colors ${
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
