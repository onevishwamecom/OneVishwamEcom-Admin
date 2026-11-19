export default function StatusTabs({ tabs, activeTab, setActiveTab, counts = {} }) {
  return (
    <div className="overflow-x-auto pb-1 scrollbar-hide">
      <div className="flex items-center gap-1 p-1 bg-slate-200/50 rounded-xl border border-slate-200/60 w-fit max-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-brand-blue shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`inline-flex items-center justify-center min-w-[1.25rem] h-4.5 px-1.5 rounded-full text-[10px] font-extrabold tabular-nums ${
                    isActive
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
