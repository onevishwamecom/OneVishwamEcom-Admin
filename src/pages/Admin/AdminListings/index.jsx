import { useMemo } from 'react';
import useAdminListings from './useAdminListings';
import ListingsMetricsStrip from './components/ListingsMetricsStrip';
import ListingsTable from './components/ListingsTable';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import { EmptyState } from '../../../components/Admin/AdminUi';
import { Skeleton, SkeletonTable, ErrorState } from '../../../components/skeleton';

function ListingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" rounded="rounded-lg" />
        <Skeleton className="h-4 w-64 max-w-full" rounded="rounded-md" />
      </div>

      {/* Unified filter cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" rounded="rounded-xl" />
        ))}
      </div>

      {/* Search bar skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
        <div className="p-3 border-b border-slate-100/60 flex items-center gap-2">
          <Skeleton className="h-8 flex-1" rounded="rounded-md" />
          <Skeleton className="h-8 w-20" rounded="rounded-md" />
        </div>
        <SkeletonTable
          rows={8}
          columns={7}
          showIndex={true}
          action={true}
          headers={['Listing', 'Contributor', 'Category', 'Location', 'Price', 'Submitted', 'Status']}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  );
}

function AdminListings() {
  const {
    TABS,
    activeTab,
    setActiveTab,
    page,
    setPage,
    allListings,
    filtered,
    contributorNameById,
    categoryById,
    unseenCount,
    isUnseen,
    openListing,
    loading,
    error,
    retry,
  } = useAdminListings();

  const counts = useMemo(() => {
    const c = { all: allListings.length };
    TABS.forEach((tab) => {
      if (tab.id === 'all') return;
      c[tab.id] = allListings.filter((l) => l.status === tab.id).length;
    });
    return c;
  }, [allListings, TABS]);

  if (loading) {
    return (
      <PageContainer>
        <ListingsSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Listings" description="Review and manage submitted listings" />
        <ErrorState
          title="Unable to load listings"
          message="The listings could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Listings"
        description="Review and manage submitted listings"
        actions={
          unseenCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3 py-1.5 text-xs font-bold">
              <i className="fa-solid fa-circle text-[6px]" aria-hidden="true" />
              {unseenCount} New
            </span>
          ) : null
        }
      />

      <ListingsMetricsStrip counts={counts} activeTab={activeTab} onSelectTab={setActiveTab} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="fa-inbox"
          title="No listings here"
          message={`There are no ${activeTab === 'all' ? '' : activeTab + ' '}listings in the queue.`}
        />
      ) : (
        <ListingsTable
          listings={filtered}
          contributorNameById={contributorNameById}
          categoryById={categoryById}
          isUnseen={isUnseen}
          onOpenListing={openListing}
          onRefresh={retry}
          page={page}
          onPageChange={setPage}
        />
      )}
    </PageContainer>
  );
}

export default AdminListings;