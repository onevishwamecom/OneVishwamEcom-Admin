import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { adminApi } from '../../../api/adminData';
import cache, { adminNamespace, CACHE_TTL } from '../../../services/cache/cacheService';
import { getCategoryById } from '../../../mock/categories';
import { COMMON_FIELDS, getCategoryFields } from './constants';

function showToast(title, text) {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 1600,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
}

function showErrorToast(title, text) {
  Swal.fire({
    icon: 'error',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
}

function buildOverrideForm(base, type) {
  if (!base) return {};
  const form = { ...(base.details || {}), ...base };
  COMMON_FIELDS.forEach((f) => {
    form[f.key] = base[f.key] ?? base.details?.[f.key] ?? form[f.key] ?? '';
  });
  form.subcategory = base.subcategory || '';
  form.priceType = base.priceType || 'fixed';
  form.videoUrl = base.videoUrl || '';
  form.pdfUrl = base.pdfUrl || base.brochure || '';
  form.documents = Array.isArray(base.documents) ? [...base.documents] : [];

  const typeKey = type || base._type || 'properties';
  const catFields = getCategoryFields(typeKey, form.subcategory);
  catFields.forEach((f) => {
    form[f.key] = base[f.key] ?? base.details?.[f.key] ?? form[f.key] ?? '';
  });

  return form;
}

export default function useListingReview() {
  const { type, id } = useParams();
  const ns = adminNamespace();
  const listingKey = `listing:${type}:${id}`;

  const [listing, setListing] = useState(() => {
    const cached = cache.get(ns, listingKey);
    return cached ? cached.data : null;
  });
  const [loading, setLoading] = useState(() => !cache.get(ns, listingKey));
  const [error, setError] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [reason, setReason] = useState('');
  const [overrideForm, setOverrideForm] = useState({});
  const [overrideImages, setOverrideImages] = useState([]);
  const overrideFileRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    // Show cached version instantly when navigating between listings.
    const cached = cache.get(ns, listingKey);
    setListing(cached ? cached.data : null);
    Promise.all([
      cache.fetch(ns, listingKey, () => adminApi.getListing(type, id), {
        ttl: CACHE_TTL.detail,
        force: true, // Always force fresh fetch from database on review page
      }),
      cache.fetch(ns, 'contributors', () => adminApi.getContributors(), {
        ttl: CACHE_TTL.listings,
      }),
    ])
      .then(([itemResult, contributorsResult]) => {
        if (cancelled) return;
        setListing(itemResult.data);
        setContributors(contributorsResult.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type, id, ns, listingKey]);

  useEffect(() => {
    if (listing) {
      setOverrideForm(buildOverrideForm(listing, type));
      const currentImgs =
        Array.isArray(listing.images) && listing.images.length > 0
          ? [...listing.images]
          : Array.isArray(listing.photos) && listing.photos.length > 0
          ? [...listing.photos]
          : Array.isArray(listing.details?.images) && listing.details.images.length > 0
          ? [...listing.details.images]
          : listing.image
          ? [listing.image]
          : [];
      setOverrideImages(currentImgs);
    }
  }, [listing, type]);

  const contributor = useMemo(
    () =>
      contributors.find((c) => (c._id || c.id) === (listing?.contributorId || listing?.lister?._id)) ||
      (listing?.contributor?.name ? listing.contributor : null) ||
      (listing?.lister?.name ? listing.lister : null) ||
      (listing
        ? {
            name: listing.channelPartnerName || listing.vendorName || 'Contributor',
            email: listing.contactEmail || listing.email || '',
            contact: listing.contact || listing.phone || '',
            city: listing.city || '',
            totalListings: 1,
          }
        : null),
    [contributors, listing],
  );
  const contributorDetail = contributor;
  const category = useMemo(() => getCategoryById(type), [type]);
  const contributedCount = contributor?.totalListings || 0;

  const startOverride = () => {
    if (!listing) return;
    const currentImgs =
      Array.isArray(listing.images) && listing.images.length > 0
        ? [...listing.images]
        : Array.isArray(listing.photos) && listing.photos.length > 0
        ? [...listing.photos]
        : Array.isArray(listing.details?.images) && listing.details.images.length > 0
        ? [...listing.details.images]
        : listing.image
        ? [listing.image]
        : [];
    setOverrideForm(buildOverrideForm(listing, type));
    setOverrideImages(currentImgs);
    setActiveModal('override');
  };

  const confirmApprove = async () => {
    try {
      const updated = await adminApi.approveListing(type, id);
      if (updated) {
        setListing(updated);
        showToast('Approved', 'Listing is now approved.');
      }
    } catch {
      showErrorToast('Failed', 'Could not approve the listing.');
    }
    setActiveModal(null);
  };

  const confirmAlterations = async () => {
    const comment = reason.trim();
    if (!comment) return;
    try {
      const updated = await adminApi.requestChanges(type, id, comment);
      if (updated) {
        setListing(updated);
        showToast('Request Sent', 'Contributor will be asked to update the listing.');
      }
    } catch {
      showErrorToast('Failed', 'Could not request alterations.');
    }
    setReason('');
    setActiveModal(null);
  };

  const confirmCancel = async () => {
    const r = reason.trim();
    if (!r) return;
    try {
      const updated = await adminApi.cancelListing(type, id, r);
      if (updated) {
        setListing(updated);
        showToast('Listing Cancelled', 'The listing is hidden and marked cancelled.');
      }
    } catch {
      showErrorToast('Failed', 'Could not cancel the listing.');
    }
    setReason('');
    setActiveModal(null);
  };

  const confirmOverride = async () => {
    const cleanImgs = (Array.isArray(overrideImages) ? overrideImages : [])
      .map((u) => (typeof u === 'string' ? u.trim() : (u?.url || '')))
      .filter(Boolean)
      .slice(0, 5);

    const payload = {
      ...overrideForm,
      images: cleanImgs,
      photos: cleanImgs,
      details: {
        ...(typeof overrideForm?.details === 'object' && overrideForm.details !== null ? overrideForm.details : {}),
        images: cleanImgs,
        photos: cleanImgs,
      },
    };
    // Status is managed via dedicated workflow modals, omit from override body
    delete payload.status;
    if (payload.possessionStatus !== undefined) {
      payload.possession = payload.possessionStatus;
      if (payload.details && typeof payload.details === "object") {
        payload.details.possessionStatus = payload.possessionStatus;
      }
    }
    try {
      const updated = await adminApi.updateListing(type, id, payload);
      if (updated) {
        const finalItem = {
          ...updated,
          images: cleanImgs.length > 0 ? cleanImgs : updated.images,
          photos: cleanImgs.length > 0 ? cleanImgs : updated.photos,
          details: {
            ...(typeof updated.details === 'object' && updated.details !== null ? updated.details : {}),
            images: cleanImgs.length > 0 ? cleanImgs : updated.details?.images,
            photos: cleanImgs.length > 0 ? cleanImgs : updated.details?.photos,
          },
        };
        setListing(finalItem);
        setOverrideImages(cleanImgs);
        // Explicitly write the updated listing into cache so any immediate read has the new state
        cache.set(ns, listingKey, finalItem);
        showToast('Override Saved', 'Listing information has been overridden.');
      }
    } catch {
      showErrorToast('Failed', 'Could not save the override.');
    }
    setActiveModal(null);
  };

  const confirmSoldOut = async () => {
    if (!listing) return;
    const isCurrentlySoldOut = listing.availabilityStatus === 'sold_out';
    const nextStatus = isCurrentlySoldOut ? 'available' : 'sold_out';
    const actionText = isCurrentlySoldOut ? 'Mark as Available' : 'Mark as Sold Out';

    const result = await Swal.fire({
      title: `${actionText}?`,
      text: isCurrentlySoldOut
        ? 'This will make the listing available to the public again.'
        : 'This will mark the listing as sold out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isCurrentlySoldOut ? '#10b981' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: actionText,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-sm font-bold px-4 py-2.5',
        cancelButton: 'rounded-xl text-sm font-bold px-4 py-2.5',
      },
    });
    if (!result.isConfirmed) return;
    
    try {
      const updated = await adminApi.updateAvailabilityStatus(type, id, nextStatus);
      if (updated) {
        setListing(updated);
        showToast(
          isCurrentlySoldOut ? 'Marked Available' : 'Marked Sold Out',
          `Listing has been marked as ${isCurrentlySoldOut ? 'available' : 'sold out'}.`,
        );
      }
    } catch {
      showErrorToast('Failed', 'Could not update availability status.');
    }
    setActiveModal(null);
  };

  const confirmDelete = async () => {
    if (!listing) return false;
    const result = await Swal.fire({
      title: 'Delete this listing permanently?',
      text: `"${listing.title || 'Untitled'}" will be permanently removed from MongoDB.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-sm font-bold px-4 py-2.5',
        cancelButton: 'rounded-xl text-sm font-bold px-4 py-2.5',
      },
    });

    if (!result.isConfirmed) return false;

    try {
      await adminApi.deleteListing(type, id);
      showToast('Deleted', 'The listing has been permanently removed.');
      return true;
    } catch {
      showErrorToast('Failed', 'Could not delete the listing.');
      return false;
    }
  };

  const images = useMemo(() => {
    if (Array.isArray(listing?.images) && listing.images.length > 0) return listing.images;
    if (Array.isArray(listing?.photos) && listing.photos.length > 0) return listing.photos;
    if (Array.isArray(listing?.details?.images) && listing.details.images.length > 0) return listing.details.images;
    if (listing?.image) return [listing.image];
    return [];
  }, [listing]);

  return {
    type,
    id,
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
    confirmDelete,
  };
}