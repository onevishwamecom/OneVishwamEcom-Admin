import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../../../store/adminSlice';

export default function WelcomeBanner({ stats }) {
  const { admin } = useAdminAuth();
  const displayName = admin?.displayName || admin?.name || 'Administrator';
  const email = admin?.email || 'admin@onevishwam.com';
  const role = (admin?.role || 'Super Admin').replace(/[-_]/g, ' ');
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'A';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const pendingCount = stats?.pendingListings ?? stats?.pending ?? 0;

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#0a192f] via-[#0f233a] to-[#134e8f] p-5 sm:p-6 text-white overflow-hidden shadow-sm border border-blue-900/40 animate-fade-in mb-6">
      {/* Ambient gradient glow orbs matching OneVishwam theme */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#90dafc]/10 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-md shrink-0 border border-white/20">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-300 tracking-wide">{greeting} 👋</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-black tracking-wider text-sky-200 uppercase border border-white/10">
                {role}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
              {displayName}
            </h1>
            <p className="text-xs text-slate-300 truncate mt-0.5 flex items-center gap-1.5">
              <i className="fa-solid fa-shield-halved text-[10px] text-sky-300" aria-hidden="true" />
              <span>OneVishwam Master Operations & Review Queue</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          <Link
            to="/admin/listings?activeTab=pending"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#90dafc] hover:bg-[#78d0f8] text-[#020617] px-4 py-2.5 rounded-xl font-black text-xs shadow-sm hover:shadow-md border border-[#70caf5] transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <i className="fa-solid fa-clock text-xs" />
            <span>Review Pending ({pendingCount})</span>
          </Link>
          <Link
            to="/admin/listings"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer"
          >
            <i className="fa-solid fa-layer-group text-xs" />
            <span>All Listings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
