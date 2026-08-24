import { Link } from 'react-router-dom';
import { SectionCard, EmptyState } from '../../../components/Admin/AdminUi';
import { PageContainer } from '../../../components/layout/PageContainer';
import useContributorProfile from './useContributorProfile';
import ProfileHeader from './components/ProfileHeader';
import StatBoxes from './components/StatBoxes';
import ItemsTable from './components/ItemsTable';
import { ProfileSkeleton, ErrorState } from '../../../components/skeleton';

function ContributorProfile() {
  const { data, loading, error, retry } = useContributorProfile();

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
          title="Unable to load contributor"
          message="This contributor's profile could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState
          icon="fa-user-slash"
          title="Contributor not found"
          message="This contributor does not exist or has been removed."
          action={
            <Link to="/admin/contributors" className="text-xs font-bold text-brand-blue hover:underline">
              ← Back to contributors
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const s = data.stats || {};

  return (
    <PageContainer>
      <Link to="/admin/contributors" className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-2">
        <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back to contributors
      </Link>

      <ProfileHeader data={data} />
      <StatBoxes stats={s} />

      <SectionCard title="Their Items" icon="fa-layer-group" subtitle={`${(data.items || []).length} listing(s) contributed`}>
        {!data.items || data.items.length === 0 ? (
          <EmptyState
            icon="fa-box-open"
            title="No items yet"
            message="This contributor has not listed any items yet."
          />
        ) : (
          <ItemsTable items={data.items} />
        )}
      </SectionCard>
    </PageContainer>
  );
}

export default ContributorProfile;