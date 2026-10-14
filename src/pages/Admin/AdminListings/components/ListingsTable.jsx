import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatINR, formatDate } from '../../../../utils';
import { StatusBadge, DataTable } from '../../../../components/Admin/AdminUi';
import { adminApi } from '../../../../api/adminData';

const COLUMNS = [
  { key: 'listing',     label: 'Listing',     className: 'max-w-[190px]' },
  { key: 'contributor', label: 'Contributor', className: 'w-24 max-w-[95px]' },
  { key: 'category',    label: 'Category',    className: 'w-px whitespace-nowrap' },
  { key: 'location',    label: 'Location',    className: 'w-28 max-w-[110px]' },
  { key: 'price',       label: 'Price',       className: 'w-24 whitespace-nowrap' },
  { key: 'submitted',   label: 'Submitted',   className: 'w-20 whitespace-nowrap' },
  { key: 'availability', label: 'Availability', className: 'w-px whitespace-nowrap' },
  { key: 'status',      label: 'Status',      className: 'w-px whitespace-nowrap' },
  { key: 'action',      label: 'Action',      className: 'w-px whitespace-nowrap text-right' },
];

function renderListingRow(
  l,
  contributorName,
  category,
  isUnseen,
  onOpenListing,
  onUpdateAvailability,
  updatingAvailability,
  onDeleteListing,
  onHoverItem,
  currentPage = 1,
  routerLocation,
) {
  const unseen = isUnseen(l._id || l.id);
  const title = l.title || l.brand || 'Untitled';
  const location = l.location || l.area || l.city || '—';
  const availability = l.availabilityStatus || 'available';
  const isSoldOut = availability === 'sold_out';

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = isSoldOut ? 'available' : 'sold_out';
    onUpdateAvailability(l, newStatus);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteListing(l);
  };

  return [
    /* Listing title + inline view link */
    <td key="listing" className="max-w-[190px] overflow-hidden">
      <Link
        to={`/admin/listings/${l._type}/${l._id}`}
        state={{
          fromPage: currentPage,
          fromPath: routerLocation ? `${routerLocation.pathname}${routerLocation.search}` : undefined,
        }}
        onClick={() => {
          try {
            sessionStorage.setItem('admin_listings_page', String(currentPage));
          } catch (e) {}
          onOpenListing?.(l);
        }}
        className={`group/link font-semibold hover:text-brand-blue transition-colors flex items-center gap-1.5 flex-nowrap min-w-0 ${
          unseen ? 'text-brand-blue' : 'text-slate-800'
        }`}
      >
        <span
          onMouseEnter={(e) => onHoverItem?.(title, e.currentTarget)}
          onMouseLeave={() => onHoverItem?.(null)}
          className="truncate block min-w-0 max-w-[190px] font-semibold text-xs text-slate-800 group-hover/link:text-brand-blue cursor-pointer"
        >
          {title}
        </span>
      </Link>
    </td>,

    /* Contributor */
    <td key="contributor" className="text-slate-600 max-w-[95px] truncate text-xs" title={contributorName}>
      <span className="truncate block max-w-[95px]">{contributorName || '—'}</span>
    </td>,

    /* Category */
    <td key="category" className="w-px whitespace-nowrap">
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
        {category?.label || l._type}
      </span>
    </td>,

    /* Location */
    <td key="location" className="text-slate-600 max-w-[110px] truncate text-xs">
      <span
        onMouseEnter={(e) => onHoverItem?.(location, e.currentTarget)}
        onMouseLeave={() => onHoverItem?.(null)}
        className="truncate block max-w-[110px] cursor-pointer hover:text-slate-900 transition-colors"
      >
        {location}
      </span>
    </td>,

    /* Price */
    <td key="price" className="font-bold text-slate-800 whitespace-nowrap text-xs">
      {formatINR(l.price, { compact: true }) || '—'}
    </td>,

    /* Submitted */
    <td key="submitted" className="text-slate-400 text-xs whitespace-nowrap">
      {formatDate(l.createdAt)}
    </td>,

    /* Availability */
    <td key="availability" className="w-px whitespace-nowrap">
      <button
        type="button"
        onClick={handleToggle}
        disabled={updatingAvailability === l._id || updatingAvailability === l.id}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize whitespace-nowrap shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 ${
          isSoldOut
            ? 'bg-red-50 text-red-600 border-red-200/70 hover:bg-red-100'
            : 'bg-emerald-50 text-emerald-600 border-emerald-200/70 hover:bg-emerald-100'
        }`}
        title={isSoldOut ? 'Click to mark as Available' : 'Click to mark as Sold Out'}
      >
        {updatingAvailability === l._id || updatingAvailability === l.id ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin text-[8px]" aria-hidden="true" />
            Updating…
          </>
        ) : isSoldOut ? (
          <>
            <i className="fa-solid fa-circle-xmark text-[8px]" aria-hidden="true" />
            Sold Out
          </>
        ) : (
          <>
            <i className="fa-solid fa-circle-check text-[8px]" aria-hidden="true" />
            Available
          </>
        )}
      </button>
    </td>,

    /* Status */
    <td key="status" className="w-px whitespace-nowrap">
      <StatusBadge status={l.status} />
    </td>,

    /* Action (Delete) */
    <td key="action" className="text-right w-px whitespace-nowrap">
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-colors"
        title="Delete listing"
        aria-label="Delete listing"
      >
        <i className="fa-solid fa-trash-can text-[10px]" aria-hidden="true" />
      </button>
    </td>,
  ];
}

export default function ListingsTable({
  listings,
  contributorNameById,
  categoryById,
  isUnseen = () => false,
  onOpenListing,
  onRefresh,
  page: controlledPage,
  onPageChange: controlledOnPageChange,
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isControlled = controlledPage !== undefined && controlledOnPageChange !== undefined;

  const derivedPage = React.useMemo(() => {
    if (isControlled) return controlledPage;
    const fromParams = parseInt(searchParams.get('page'), 10);
    if (!isNaN(fromParams) && fromParams > 0) return fromParams;
    try {
      const fromStorage = parseInt(sessionStorage.getItem('admin_listings_page'), 10);
      if (!isNaN(fromStorage) && fromStorage > 0) return fromStorage;
    } catch (e) {}
    return 1;
  }, [isControlled, controlledPage, searchParams]);

  const page = derivedPage;

  const setPage = React.useCallback((newPageOrFn) => {
    if (isControlled) {
      controlledOnPageChange(newPageOrFn);
    } else {
      const current = parseInt(searchParams.get('page'), 10) || 1;
      const next = typeof newPageOrFn === 'function' ? newPageOrFn(current) : newPageOrFn;
      try {
        sessionStorage.setItem('admin_listings_page', String(next));
      } catch (e) {}
      setSearchParams((prevParams) => {
        const updated = new URLSearchParams(prevParams);
        if (next > 1) {
          updated.set('page', String(next));
        } else {
          updated.delete('page');
        }
        return updated;
      });
    }
  }, [isControlled, controlledOnPageChange, searchParams, setSearchParams]);

  const rowsPerPage = 10;
  const [updatingAvailability, setUpdatingAvailability] = React.useState(null);
  const [hoverPill, setHoverPill] = React.useState(null);

  const handleHoverItem = (text, targetElement) => {
    if (!text || text === '—' || !targetElement) {
      setHoverPill(null);
      return;
    }
    // Only show pill if text is actually long and truncated (started underlapping/overflowing)
    const isTruncated = targetElement.scrollWidth > (targetElement.clientWidth + 1);
    if (!isTruncated) {
      setHoverPill(null);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    setHoverPill({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top,
      bottom: rect.bottom,
    });
  };

  React.useEffect(() => {
    if (!hoverPill) return;
    const hidePill = () => setHoverPill(null);
    window.addEventListener('scroll', hidePill, true);
    window.addEventListener('resize', hidePill);
    return () => {
      window.removeEventListener('scroll', hidePill, true);
      window.removeEventListener('resize', hidePill);
    };
  }, [hoverPill]);

  // Debounce search query — only reset page when user actually types a new search query
  const prevSearchRef = React.useRef(searchQuery);
  React.useEffect(() => {
    if (prevSearchRef.current === searchQuery) {
      return;
    }
    prevSearchRef.current = searchQuery;
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setPage]);

  const searchLower = debouncedSearchQuery.toLowerCase();
  const filtered = listings.filter(
    (l) => {
      const title = (l.title || l.brand || '').toLowerCase();
      const contributor = (contributorNameById[l.contributorId] || l.lister?.name || '').toLowerCase();
      const catLabel = (categoryById[l._type]?.label || l._type || '').toLowerCase();
      const location = (l.location || l.area || l.city || '').toLowerCase();
      
      const matchesSearch = title.includes(searchLower) ||
        contributor.includes(searchLower) ||
        catLabel.includes(searchLower) ||
        location.includes(searchLower);
      
      const matchesCategory = !selectedCategory || l._type === selectedCategory;
      
      return matchesSearch && matchesCategory;
    },
  );

  const handleUpdateAvailability = async (listing, newStatus) => {
    if (listing.availabilityStatus === newStatus) return;

    const actionText = newStatus === 'sold_out' ? 'Sold Out' : 'Available';
    const result = await Swal.fire({
      title: `Mark as ${actionText}?`,
      text: newStatus === 'sold_out'
        ? 'Are you sure you want to mark this listing as Sold Out?'
        : 'Are you sure you want to mark this listing as Available?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'sold_out' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, Mark ${actionText}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-sm font-bold px-4 py-2.5',
        cancelButton: 'rounded-xl text-sm font-bold px-4 py-2.5',
      },
    });

    if (!result.isConfirmed) return;

    const id = listing._id || listing.id;
    setUpdatingAvailability(id);

    try {
      await adminApi.updateAvailabilityStatus(listing._type, id, newStatus);

      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Listing is now marked as ${actionText}.`,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
        },
      });

      if (onRefresh) {
        await onRefresh();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to update availability:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update availability status. Please try again.',
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    } finally {
      setUpdatingAvailability(null);
    }
  };

  const handleDeleteListing = async (listing) => {
    const id = listing._id || listing.id;
    const title = listing.title || listing.brand || 'Untitled';
    const result = await Swal.fire({
      title: 'Delete this item?',
      text: `"${title}" will be permanently removed from MongoDB.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
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
      await adminApi.deleteListing(listing._type, id);
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The listing has been permanently removed.',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' },
      });
      if (onRefresh) {
        await onRefresh();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to delete listing:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete listing. Please try again.',
        customClass: { popup: 'rounded-2xl' },
      });
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const effectivePage = filtered.length > 0 && page > totalPages ? totalPages : page;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden relative">
      {/* Search / filter bar */}
      <div className="p-3 border-b border-slate-100/60">
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search listings…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[160px] rounded-md border border-slate-200 py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-150"
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-200 py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          >
            <option value="">All Categories</option>
            <option value="properties">Properties</option>
            <option value="vehicles">Vehicles</option>
            <option value="groceries">Groceries</option>
            <option value="garments">Garments</option>
            <option value="jewellery">Jewellery</option>
            <option value="finance">Finance</option>
            <option value="services">Services</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        rows={filtered}
        page={effectivePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        renderRow={(l) =>
          renderListingRow(
            l,
            contributorNameById[l.contributorId] || l.lister?.name || l.contributor?.name || l.channelPartnerName || l.vendorName || 'Contributor',
            categoryById[l._type] || {},
            isUnseen,
            onOpenListing,
            handleUpdateAvailability,
            updatingAvailability,
            handleDeleteListing,
            handleHoverItem,
            effectivePage,
            location,
          )
        }
        getRowClassName={(l) =>
          isUnseen(l._id || l.id)
            ? 'bg-brand-blue/[0.04] border-l-2 border-l-brand-blue'
            : ''
        }
        emptyIcon="fa-inbox"
        emptyTitle="No listings found"
        emptyMessage={
          searchQuery
            ? 'No listings match your search criteria.'
            : 'No listings found for the current filter.'
        }
        className="rounded-none border-0 shadow-none"
      />

      {/* Small floating hover pill anchored directly on top of the corresponding column */}
      {hoverPill && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none px-2.5 py-1 bg-slate-900/95 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700/80 backdrop-blur-md max-w-xs whitespace-normal break-words leading-tight animate-fade-in"
          style={{
            left: Math.max(80, Math.min(window.innerWidth - 80, hoverPill.x)),
            top: hoverPill.y > 60 ? hoverPill.y - 6 : hoverPill.bottom + 6,
            transform: hoverPill.y > 60 ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
          }}
        >
          <span>{hoverPill.text}</span>
          {hoverPill.y > 60 ? (
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900/95" />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-900/95" />
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
