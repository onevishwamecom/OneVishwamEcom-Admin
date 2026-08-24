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
          <StatCard key={s.key} label={s.label} value={stats[s.key]} icon={s.icon} iconClass={s.iconClass} valueClass={s.valueClass} to={s.to} />
        ))}
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