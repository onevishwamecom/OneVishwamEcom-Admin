import { SectionCard } from '../../../components/Admin/AdminUi';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import useAdminDashboard from './useAdminDashboard';
import WelcomeBanner from './components/WelcomeBanner';
import StatCard from './components/StatCard';
import ContributorsTable from './components/ContributorsTable';
import { DashboardSkeleton, ErrorState } from '../../../components/skeleton';

const STATS = [
  {
    key: 'totalListings',
    label: 'Total Items Added',
    icon: 'fa-layer-group',
    gradient: 'from-brand-blue to-blue-600',
    to: 'all',
  },
  {
    key: 'pendingListings',
    label: 'Pending Review',
    icon: 'fa-hourglass-half',
    gradient: 'from-amber-400 to-amber-500',
    to: 'pending',
  },
  {
    key: 'approvedListings',
    label: 'Approved & Live',
    icon: 'fa-circle-check',
    gradient: 'from-emerald-400 to-emerald-600',
    to: 'approved',
  },
  {
    key: 'cancelledListings',
    label: 'Cancelled / Rejected',
    icon: 'fa-ban',
    gradient: 'from-rose-400 to-rose-600',
    to: 'cancelled',
  },
];

function AdminDashboard() {
  const { stats, contributors, loading, error, retry } = useAdminDashboard();

  if (loading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load dashboard"
          message="The dashboard data could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ── OneVishwam Executive Hero Banner ── */}
      <WelcomeBanner stats={stats} />

      {/* ── 4 Stat Cards Matching OneVishwam Standard ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats?.[s.key] ?? stats?.[s.key.replace('Listings', '')] ?? 0}
            icon={s.icon}
            gradient={s.gradient}
            to={s.to}
          />
        ))}
      </div>

      {/* ── Unified 2-Column Analytics & Real-Time Intelligence Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-6">
        {/* Card 1: Live Website Traffic & Visitors */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
          {/* Top brand accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-sky-400 to-emerald-400" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center text-lg border border-blue-100/80 shadow-xs shrink-0">
                  <i className="fa-solid fa-chart-line" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Live Website Traffic &amp; Visitors</h3>
                  </div>
                  <p className="text-xs text-slate-500">24-hour deduplicated visitor tracking</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-time
              </span>
            </div>

            {/* 3 Metrics in a crisp responsive grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Visitors</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
                  {stats?.visitorStats?.totalVisitors != null
                    ? Number(stats.visitorStats.totalVisitors).toLocaleString('en-IN')
                    : '—'}
                </span>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Visits Today</span>
                <span className="text-xl sm:text-2xl font-black text-brand-blue mt-1 tabular-nums">
                  {stats?.visitorStats?.visitsToday != null
                    ? Number(stats.visitorStats.visitsToday).toLocaleString('en-IN')
                    : '—'}
                </span>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Online Now</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 tabular-nums flex items-center gap-1.5">
                  {stats?.visitorStats?.activeVisitors != null
                    ? Number(stats.visitorStats.activeVisitors).toLocaleString('en-IN')
                    : '1'}
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: OneVishwam Website Users */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
          {/* Top brand accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-navy via-brand-blue to-sky-400" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-sky-50 text-brand-blue flex items-center justify-center text-lg border border-sky-100/80 shadow-xs shrink-0">
                  <i className="fa-solid fa-user-check" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">OneVishwam Website Users</h3>
                  <p className="text-xs text-slate-500">Customer account registrations from MongoDB</p>
                </div>
              </div>

              <Link
                to="/admin/users"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#90dafc] hover:bg-[#78d0f8] text-[#020617] font-black text-xs shadow-xs border border-[#70caf5] transition-all shrink-0 cursor-pointer active:scale-95"
              >
                <span>View Users</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            {/* 2 Metrics in a crisp responsive grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Logged In Users</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                  {typeof stats?.userStats?.loggedInUsers === 'number'
                    ? stats.userStats.loggedInUsers.toLocaleString('en-IN')
                    : (stats?.userStats?.loggedInUsers ?? 0)}
                </span>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Registered</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
                  {typeof stats?.userStats?.totalUsers === 'number'
                    ? stats.userStats.totalUsers.toLocaleString('en-IN')
                    : (stats?.userStats?.totalUsers ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Team Members SectionCard ── */}
      <SectionCard
        title="Team Members"
        subtitle="People who list items — click a name to see their contributions"
        icon="fa-users"
        action={
          <Link
            to="/admin/contributors"
            className="text-xs font-bold text-brand-blue hover:text-brand-blue/70 transition-colors"
          >
            View all →
          </Link>
        }
      >
        <ContributorsTable contributors={contributors} />
      </SectionCard>
    </PageContainer>
  );
}

export default AdminDashboard;
