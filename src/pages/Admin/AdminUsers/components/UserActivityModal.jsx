import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../../api/adminData';

const SECTOR_META = {
  properties: { label: 'Properties', icon: 'fa-house-chimney', color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  vehicles: { label: 'Vehicles', icon: 'fa-car', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  electronics: { label: 'Electronics', icon: 'fa-tv', color: 'from-rose-500 to-red-600', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  garments: { label: 'Garments', icon: 'fa-shirt', color: 'from-purple-500 to-pink-600', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  jewellery: { label: 'Jewellery', icon: 'fa-gem', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  groceries: { label: 'Groceries', icon: 'fa-basket-shopping', color: 'from-green-500 to-emerald-600', badge: 'bg-green-50 text-green-700 border-green-200' },
  bedding: { label: 'Bedding', icon: 'fa-bed', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  finance: { label: 'Finance', icon: 'fa-building-columns', color: 'from-yellow-500 to-amber-600', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  general: { label: 'General Browsing', icon: 'fa-compass', color: 'from-slate-500 to-slate-700', badge: 'bg-slate-50 text-slate-700 border-slate-200' },
};

function formatTime(dateStr) {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recently';
  return d.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function UserActivityModal({ user, onClose }) {
  const [details, setDetails] = useState(user);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!user?._id) return;
    let mounted = true;
    setLoading(true);
    adminApi
      .getUserActivity(user._id)
      .then((res) => {
        if (mounted && res?.user) {
          setDetails((prev) => ({ ...prev, ...res.user }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) return null;

  const interests = details?.interests || [];
  const browsingHistory = details?.browsingHistory || [];
  const primary = (details?.primaryInterest || interests[0]?.category || 'properties').toLowerCase();
  const primaryMeta = SECTOR_META[primary] || SECTOR_META.properties;

  const filteredHistory = browsingHistory.filter((item) => {
    if (activeTab === 'all') return true;
    return (item.category || '').toLowerCase() === activeTab.toLowerCase();
  });

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>

          <div className="flex items-start gap-4 pr-10">
            {details.avatar ? (
              <img
                src={details.avatar}
                alt={details.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl border-2 border-white/20 shadow-md shrink-0">
                {(details.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold truncate text-white">{details.name || 'User'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {details.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-1 flex-wrap">
                {details.email && (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-envelope text-slate-400 text-[10px]" />
                    {details.email}
                  </span>
                )}
                {details.phone && (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-phone text-slate-400 text-[10px]" />
                    {details.phone}
                  </span>
                )}
                {(details.city || details.area) && (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-slate-400 text-[10px]" />
                    {[details.city, details.area].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Interest Highlight Pill */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Primary Interest:
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white font-bold border border-white/20 backdrop-blur-xs">
                <i className={`fa-solid ${primaryMeta.icon} text-amber-400`} />
                <span className="capitalize">{primaryMeta.label}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-slate-300 text-[11px]">
                Total Views: <strong className="text-white">{browsingHistory.length}</strong> page(s)
              </div>
              {details._id && (
                <Link
                  to={`/admin/users/${details._id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 font-bold text-xs transition-all shadow-xs"
                >
                  <span>Open Full Detail Page</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sector Interest Summary Pills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-brand-blue" />
              Sectors Visited & Engagement
            </h3>

            {interests.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                No specific sector visits recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interests.map((item) => {
                  const meta = SECTOR_META[item.category?.toLowerCase()] || SECTOR_META.general;
                  const isPrimary = (item.category || '').toLowerCase() === primary;
                  return (
                    <div
                      key={item.category}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isPrimary
                          ? 'bg-brand-blue/5 border-brand-blue/30 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-800 capitalize flex items-center gap-1.5 truncate">
                          <i className={`fa-solid ${meta.icon} text-slate-500 text-xs`} />
                          {meta.label}
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800">
                          {item.viewCount || 1}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        Last seen: {formatTime(item.lastVisitedAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Specific Viewed Listings / Properties */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-brand-blue" />
                Actual Properties & Listings Visited ({filteredHistory.length})
              </h3>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({browsingHistory.length})
                </button>
                {interests.map((it) => (
                  <button
                    key={it.category}
                    onClick={() => setActiveTab(it.category.toLowerCase())}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      activeTab === it.category.toLowerCase()
                        ? 'bg-white text-brand-blue shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {it.category} ({it.viewCount})
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <i className="fa-solid fa-circle-notch fa-spin text-xl text-brand-blue mb-2 block" />
                Fetching browsing history…
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs">
                <i className="fa-solid fa-eye-slash text-2xl text-slate-300 mb-2 block" />
                No specific listings viewed yet for this filter.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {filteredHistory.map((item, idx) => {
                  const meta = SECTOR_META[(item.category || '').toLowerCase()] || SECTOR_META.general;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-brand-blue/40 transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <i className={`fa-solid ${meta.icon} text-lg`} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${meta.badge}`}>
                              {meta.label}
                            </span>
                            {item.price && (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {item.price}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {item.title || item.path || 'Viewed Page'}
                          </h4>
                          {item.location && (
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <i className="fa-solid fa-location-dot text-[10px] text-slate-400" />
                              {item.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block whitespace-nowrap font-medium">
                          {formatTime(item.visitedAt)}
                        </span>
                        {item.path && (
                          <a
                            href={`https://onevishwam.com${item.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-blue-700 mt-1 transition-colors"
                          >
                            <span>Open on site</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
