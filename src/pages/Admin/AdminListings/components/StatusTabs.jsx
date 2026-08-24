export default function StatusTabs({ tabs, activeTab, setActiveTab, counts = {} }) {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-hide">
      <ul className="flex flex-wrap text-sm font-medium text-center text-slate-600 border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];
          return (
            <li key={tab.id} className="me-2">
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 p-4 rounded-t-lg transition-colors ${
                  isActive
                    ? 'text-brand-blue bg-slate-100 border-b-2 border-brand-blue -mb-px'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                {typeof count === 'number' && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-brand-blue text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}