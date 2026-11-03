const SECTOR_META = {
  properties: { label: 'Properties & Real Estate', icon: 'fa-house-chimney', color: 'from-blue-600 to-indigo-700', bg: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  vehicles: { label: 'Vehicles & Automobiles', icon: 'fa-car', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  electronics: { label: 'Electronics & Appliances', icon: 'fa-tv', color: 'from-rose-500 to-red-600', bg: 'bg-rose-500', pill: 'bg-rose-50 text-rose-700 border-rose-200' },
  garments: { label: 'Fashion & Garments', icon: 'fa-shirt', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-500', pill: 'bg-purple-50 text-purple-700 border-purple-200' },
  jewellery: { label: 'Jewellery & Gold', icon: 'fa-gem', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  groceries: { label: 'Daily Groceries', icon: 'fa-basket-shopping', color: 'from-green-500 to-emerald-600', bg: 'bg-green-500', pill: 'bg-green-50 text-green-700 border-green-200' },
  bedding: { label: 'Home & Bedding', icon: 'fa-bed', color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500', pill: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  finance: { label: 'Loans & Finance', icon: 'fa-building-columns', color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-500', pill: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  general: { label: 'General Exploration', icon: 'fa-compass', color: 'from-slate-600 to-slate-800', bg: 'bg-slate-500', pill: 'bg-slate-50 text-slate-700 border-slate-200' },
};

function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds < 1) return '< 1m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Never';
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function InterestInsights({ customer }) {
  if (!customer) return null;

  const interests = customer.interests || [];
  const browsingHistory = customer.browsingHistory || [];

  const primarySector = (customer.primaryInterest || interests[0]?.category || 'properties').toLowerCase();
  const primaryMeta = SECTOR_META[primarySector] || SECTOR_META.properties;

  const totalSectorViews = interests.reduce((acc, i) => acc + (i.viewCount || 1), 0) || 1;

  const totalDuration = customer.totalTimeSpent || customer.sessionDuration || 0;

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Primary Interest Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center text-white text-lg shadow-sm shrink-0">
            <i className={`fa-solid ${primaryMeta.icon}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Interest</p>
            <p className="text-lg font-black text-slate-900 truncate capitalize mt-0.5">
              {primaryMeta.label.split('&')[0]}
            </p>
          </div>
        </div>

        {/* Listings Viewed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-lg shadow-sm shrink-0">
            <i className="fa-solid fa-eye" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Items Explored</p>
            <p className="text-2xl font-black text-amber-600 tabular-nums mt-0.5">
              {browsingHistory.length}
            </p>
          </div>
        </div>

        {/* Time Spent on Platform */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg shadow-sm shrink-0">
            <i className="fa-solid fa-hourglass-half" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Spent on Site</p>
            <p className="text-2xl font-black text-emerald-600 tabular-nums mt-0.5">
              {formatDuration(totalDuration)}
            </p>
          </div>
        </div>

        {/* Last Login / Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-sm shrink-0">
            <i className="fa-solid fa-clock-rotate-left" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Seen</p>
            <p className="text-lg font-black text-slate-900 truncate mt-0.5">
              {timeAgo(customer.lastActiveAt || customer.lastLogin)}
            </p>
          </div>
        </div>
      </div>

      {/* Sector Engagement Breakdown Visual */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-brand-blue" />
              Customer Sector Interests & Engagement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of customer attention based on pages, categories, and listings visited
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
            {interests.length} Sector(s) Visited
          </span>
        </div>

        {interests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs">
            <i className="fa-solid fa-compass text-2xl text-slate-300 mb-2 block" />
            No specific sector engagement recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {interests.map((item) => {
              const meta = SECTOR_META[item.category?.toLowerCase()] || SECTOR_META.general;
              const count = item.viewCount || 1;
              const percentage = Math.round((count / totalSectorViews) * 100);
              const isPrimary = item.category?.toLowerCase() === primarySector;

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
                        <i className={`fa-solid ${meta.icon}`} />
                      </span>
                      <span className="font-bold text-slate-800 capitalize">{meta.label}</span>
                      {isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-blue text-white shadow-2xs">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <strong className="text-slate-900 font-extrabold">{count}</strong> views
                      <span className="text-slate-400">({percentage}%)</span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPrimary
                          ? 'bg-gradient-to-r from-brand-blue to-indigo-600 shadow-sm'
                          : meta.bg
                      }`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
