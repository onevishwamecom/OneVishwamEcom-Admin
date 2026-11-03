import { Link } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { ProfileSkeleton, ErrorState } from '../../../components/skeleton';
import { EmptyState } from '../../../components/Admin/AdminUi';
import useCustomerProfile from './useCustomerProfile';
import CustomerHeader from './components/CustomerHeader';
import InterestInsights from './components/InterestInsights';
import BrowsingHistoryList from './components/BrowsingHistoryList';

export default function CustomerProfile() {
  const { customer, loading, error, retry } = useCustomerProfile();

  if (loading) {
    return (
      <PageContainer>
        <ProfileSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load customer profile"
          message="We could not fetch this customer's profile and browsing activity. Please check your connection and try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <EmptyState
          icon="fa-user-slash"
          title="Customer Not Found"
          message="This customer does not exist, has been removed, or could not be found."
          action={
            <Link
              to="/admin/users"
              className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-left" />
              <span>Back to Website Users</span>
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/users"
            className="text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors inline-flex items-center gap-2 group"
          >
            <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1" />
            <span>Back to Website Users</span>
          </Link>

          <span className="text-[11px] font-semibold text-slate-400">
            Customer Profile & Activity Analytics
          </span>
        </div>

        {/* Customer Identity & Contact Action Card */}
        <CustomerHeader customer={customer} />

        {/* Customer Interest Breakdown & Key Metrics */}
        <InterestInsights customer={customer} />

        {/* Customer Browsed Listings History */}
        <BrowsingHistoryList history={customer.browsingHistory || []} />
      </div>
    </PageContainer>
  );
}
