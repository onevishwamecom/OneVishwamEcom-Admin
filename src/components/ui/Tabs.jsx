import React from 'react';

/**
 * Segmented toggle control (e.g. [Individual Listings (5)] [Bulk Upload Batches])
 */
export function SegmentedTabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  activeColor = 'default',
}) {
  return (
    <div
      className={`flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit border border-slate-200 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeStyles =
          tab.activeColor === 'emerald' || (isActive && activeColor === 'emerald')
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-white text-slate-900 shadow-xs';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
              isActive ? activeStyles : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.icon && <i className={`fa-solid ${tab.icon} text-xs`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                  isActive ? 'bg-black/10 text-current' : 'bg-slate-300/70 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Filter pills with count badge matching screenshot:
 * [All 5] [Pending 5] [Approved 0] [Changes Required 0] [Cancelled 0]
 */
export function FilterPills({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  ariaLabel = 'Filter options',
}) {
  return (
    <div className={`overflow-x-auto scrollbar-hide ${className}`}>
      <nav className="flex gap-1 min-w-max items-center" aria-label={ariaLabel}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default FilterPills;
