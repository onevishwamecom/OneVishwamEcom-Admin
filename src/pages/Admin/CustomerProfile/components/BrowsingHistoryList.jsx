import { useState, useMemo } from 'react';

const SECTOR_TAGS = {
  properties: { label: 'Properties', icon: 'fa-house-chimney', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  automobiles: { label: 'Automobiles', icon: 'fa-car', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  electronics: { label: 'Electronics', icon: 'fa-tv', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  garments: { label: 'Fashion', icon: 'fa-shirt', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  jewellery: { label: 'Jewellery', icon: 'fa-gem', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  groceries: { label: 'Groceries', icon: 'fa-basket-shopping', badge: 'bg-green-50 text-green-700 border-green-200' },
  bedding: { label: 'Home & Bedding', icon: 'fa-bed', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  finance: { label: 'Finance', icon: 'fa-building-columns', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  general: { label: 'General', icon: 'fa-compass', badge: 'bg-slate-50 text-slate-700 border-slate-200' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function normalizeSector(c = '') {
  const s = String(c || '').toLowerCase().trim();
  if (s === 'vehicle' || s === 'vehicles' || s === 'automobile' || s === 'automobiles') return 'automobiles';
  if (s === 'property' || s === 'real-estate') return 'properties';
  if (s === 'grocery') return 'groceries';
  if (s === 'garment') return 'garments';
  if (s === 'bedding' || s === 'bedding-comfort') return 'comfort';
  return s || 'general';
}

export default function BrowsingHistoryList({ history = [] }) {
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Sectors available in user's history
  const availableSectors = useMemo(() => {
    const counts = {};
    history.forEach((item) => {
      const cat = normalizeSector(item.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [history]);

  // Filter & sort
  const filteredList = useMemo(() => {
    let result = [...history];

    if (selectedSector !== 'all') {
      result = result.filter(
        (item) => normalizeSector(item.category) === selectedSector.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.listingId && item.listingId.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const timeA = new Date(a.visitedAt || 0).getTime();
      const timeB = new Date(b.visitedAt || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [history, selectedSector, searchQuery, sortOrder]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-clock-rotate-left" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Browsed Listings & Content
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {history.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exact properties, vehicles, and products this customer clicked and inspected on onevishwam.com
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search viewed listings..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand-blue focus:outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:border-brand-blue focus:outline-none transition-all cursor-pointer text-slate-700"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Category Sector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedSector('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
            selectedSector === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <span>All Sectors</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              selectedSector === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {history.length}
          </span>
        </button>

        {Object.entries(availableSectors).map(([sectorKey, count]) => {
          const meta = SECTOR_TAGS[sectorKey] || {
            label: sectorKey.charAt(0).toUpperCase() + sectorKey.slice(1),
            icon: 'fa-tag',
          };
          const isSelected = selectedSector.toLowerCase() === sectorKey.toLowerCase();

          return (
            <button
              key={sectorKey}
              type="button"
              onClick={() => setSelectedSector(sectorKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <i className={`fa-solid ${meta.icon} text-[11px]`} />
              <span>{meta.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {filteredList.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 text-2xl mb-3">
            <i className="fa-solid fa-eye-slash" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {history.length === 0
              ? 'No Browsed Listings Recorded Yet'
              : 'No Listings Match the Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {history.length === 0
              ? 'When this customer visits and views properties, vehicles, or items on onevishwam.com, their browsing history and preferences will appear here in real time.'
              : 'Try clearing the search query or switching sector filters to view other activity.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-brand-blue hover:bg-slate-50 transition-all shadow-2xs"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item, idx) => {
            const cat = normalizeSector(item.category);
            const tagMeta = SECTOR_TAGS[cat] || {
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              icon: 'fa-compass',
              badge: 'bg-slate-50 text-slate-700 border-slate-200',
            };

            const fullUrl = item.path
              ? (item.path.startsWith('http') ? item.path : `https://onevishwam.com${item.path}`)
              : null;

            return (
              <div
                key={item._id || item.listingId || idx}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-300 shadow-2xs hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || 'Listing Thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 gap-1.5">
                      <i className={`fa-solid ${tagMeta.icon} text-2xl`} />
                      <span className="text-[11px] font-semibold text-slate-400">No Image Available</span>
                    </div>
                  )}

                  {/* Sector Badge Over Image */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md shadow-xs border ${tagMeta.badge}`}
                    >
                      <i className={`fa-solid ${tagMeta.icon} text-[10px]`} />
                      {tagMeta.label}
                    </span>
                  </div>

                  {/* Timestamp Badge */}
                  {item.visitedAt && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/70 backdrop-blur-md text-white shadow-2xs">
                        <i className="fa-regular fa-clock text-[9px]" />
                        {timeAgo(item.visitedAt)}
                      </span>
                    </div>
                  )}

                  {/* Price Tag if available */}
                  {item.price && (
                    <div className="absolute bottom-2.5 right-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-white/95 backdrop-blur-md text-slate-900 shadow-sm border border-slate-100">
                        {item.price.startsWith('₹') ? item.price : `₹${item.price}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h4
                      className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors"
                      title={item.title}
                    >
                      {item.title || 'Untitled Listing'}
                    </h4>

                    {item.location && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                        <i className="fa-solid fa-location-dot text-rose-500 text-[11px] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    {item.listingId ? (
                      <span className="text-[11px] font-mono text-slate-400 truncate" title={`ID: ${item.listingId}`}>
                        ID: {item.listingId.slice(-8)}
                      </span>
                    ) : (
                      <span />
                    )}

                    {fullUrl ? (
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-brand-blue hover:text-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer border border-slate-200/80 hover:border-brand-blue"
                      >
                        <span>View on Site</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400">Preview Only</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
