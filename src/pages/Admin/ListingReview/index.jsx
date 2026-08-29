import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../../components/Admin/AdminUi';
import { PageContainer } from '../../../components/layout/PageContainer';
import useListingReadStatus from '../../../hooks/useListingReadStatus';
import useListingReview from './useListingReview';
import NotFound from './components/NotFound';
import AdminActions from './components/AdminActions';
import ListingInfoCard from './components/ListingInfoCard';
import ContributorInfoCard from './components/ContributorInfoCard';
import ApproveModal from './components/ApproveModal';
import AlterationsModal from './components/AlterationsModal';
import CancelModal from './components/CancelModal';
import OverrideModal from './components/OverrideModal';
import { DetailPageSkeleton, ErrorState } from '../../../components/skeleton';

function ListingReview() {
  const {
    type,
    listing,
    loading,
    error,
    images,
    activeModal,
    setActiveModal,
    reason,
    setReason,
    overrideForm,
    setOverrideForm,
    overrideImages,
    setOverrideImages,
    overrideFileRef,
    contributor,
    contributorDetail,
    category,
    contributedCount,
    startOverride,
    confirmApprove,
    confirmAlterations,
    confirmCancel,
    confirmOverride,
    confirmSoldOut,
  } = useListingReview();

  const { markAsRead } = useListingReadStatus();

  useEffect(() => {
    const id = listing?._id || listing?.id;
    if (id) markAsRead(id);
  }, [listing, markAsRead]);

  if (loading) {
    return (
      <PageContainer>
        <DetailPageSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load listing"
          message="The listing could not be fetched. Please try again."
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  if (!listing) {
    return (
      <PageContainer>
        <NotFound />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/listings"
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Back to listings"
          >
            <i className="fa-solid fa-arrow-left text-sm" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight break-words">{listing.title}</h1>
            <p className="text-slate-500 font-medium mt-0.5 flex items-center gap-2">
              <span className="capitalize">{category?.label || type}</span>
              <span>·</span>
              <StatusBadge status={listing.status} />
            </p>
          </div>
        </div>
      </div>

      <AdminActions
        listing={listing}
        setActiveModal={setActiveModal}
        setReason={setReason}
        startOverride={startOverride}
        confirmSoldOut={confirmSoldOut}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ListingInfoCard listing={listing} images={images} category={category} />
        <ContributorInfoCard
          contributor={contributor}
          contributorDetail={contributorDetail}
          contributedCount={contributedCount}
        />
      </div>

      <ApproveModal
        open={activeModal === 'approve'}
        onClose={() => setActiveModal(null)}
        listing={listing}
        onConfirm={confirmApprove}
      />

      <AlterationsModal
        open={activeModal === 'alterations'}
        onClose={() => setActiveModal(null)}
        reason={reason}
        setReason={setReason}
        onConfirm={confirmAlterations}
      />

      <CancelModal
        open={activeModal === 'cancel'}
        onClose={() => setActiveModal(null)}
        reason={reason}
        setReason={setReason}
        onConfirm={confirmCancel}
      />

      <OverrideModal
        open={activeModal === 'override'}
        onClose={() => setActiveModal(null)}
        listing={listing}
        category={category}
        overrideForm={overrideForm}
        setOverrideForm={setOverrideForm}
        overrideImages={overrideImages}
        setOverrideImages={setOverrideImages}
        overrideFileRef={overrideFileRef}
        onConfirm={confirmOverride}
      />
    </PageContainer>
  );
}

export default ListingReview;