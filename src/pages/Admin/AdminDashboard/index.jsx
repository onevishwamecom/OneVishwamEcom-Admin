import { SectionCard } from '../../../components/Admin/AdminUi';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import useAdminDashboard from './useAdminDashboard';
import StatCard from './components/StatCard';
import ContributorsTable from './components/ContributorsTable';
import { DashboardSkeleton, ErrorState } from '../../../components/skeleton';

const STATS = [
  { key: 'totalListings', label: 'Items Added', icon: 'fa-layer-group', iconClass: 'bg-gradient-to-br from-brand-blue to-brand-blue/70', valueClass: 'text-brand-blue', to: 'all' },
  { key: 'pendingListings', label: 'Pending Review', icon: 'fa-hourglass-half', iconClass: 'bg-gradient-to-br from-amber-400 to-amber-500', valueClass: 'text-amber-600', to: 'pending' },
  { key: 'approvedListings', label: 'Approved', icon: 'fa-circle-check', iconClass: 'bg-gradient-to-br from-emerald-400 to-emerald-600', valueClass: 'text-emerald-600', to: 'approved' },
  { key: 'cancelledListings', label: 'Cancelled', icon: 'fa-ban', iconClass: 'bg-gradient-to-br from-rose-400 to-rose-600', valueClass: 'text-rose-600', to: 'cancelled' },
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
      <PageHeader
        title="Master"
        description="Items added by contributors and their review status"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats?.[s.key] ?? stats?.[s.key.replace('Listings', '')] ?? 0}
            icon={s.icon}
            iconClass={s.iconClass}
            valueClass={s.valueClass}
            to={s.to}
          />
        ))}
      </div>

      {/* Website Live Visitors & Traffic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-elevated border border-indigo-500/20 my-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 text-2xl shrink-0">
              <i className="fa-solid fa-chart-line" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <h3 className="text-lg font-bold text-white">Live Website Traffic & Visitors</h3>
              </div>
              <p className="text-xs text-slate-300">Real-time aggregate visitor tracking with 24-hour deduplication</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end flex-wrap sm:flex-nowrap">
            <div className="text-center md:text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Visitors</p>
              <p className="text-2xl font-extrabold text-amber-400">
                {stats?.visitorStats?.totalVisitors != null
                  ? Number(stats.visitorStats.totalVisitors).toLocaleString('en-IN')
                  : '—'}
              </p>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="text-center md:text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Visits Today</p>
              <p className="text-2xl font-extrabold text-cyan-400">
                {stats?.visitorStats?.visitsToday != null
                  ? Number(stats.visitorStats.visitsToday).toLocaleString('en-IN')
                  : '—'}
              </p>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="text-center md:text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Online Now</p>
              <p className="text-2xl font-extrabold text-emerald-400">
                {stats?.visitorStats?.activeVisitors != null
                  ? Number(stats.visitorStats.activeVisitors).toLocaleString('en-IN')
                  : '1'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Website Users Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 rounded-2xl p-6 text-white shadow-elevated border border-white/10 my-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue text-2xl shrink-0">
              <i className="fa-solid fa-user-check" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">OneVishwam Website Users</h3>
              <p className="text-xs text-slate-300">Customer account registrations & logged-in activity from MongoDB</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-center md:text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Logged In</p>
              <p className="text-2xl font-extrabold text-emerald-400">
                {typeof stats?.userStats?.loggedInUsers === 'number'
                  ? stats.userStats.loggedInUsers.toLocaleString('en-IN')
                  : (stats?.userStats?.loggedInUsers ?? 0)}
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center md:text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Registered</p>
              <p className="text-2xl font-extrabold text-white">
                {typeof stats?.userStats?.totalUsers === 'number'
                  ? stats.userStats.totalUsers.toLocaleString('en-IN')
                  : (stats?.userStats?.totalUsers ?? 0)}
              </p>
            </div>
            <Link
              to="/admin/users"
              className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all shrink-0"
            >
              <span>View Users</span>
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>
        </div>
      </div>

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