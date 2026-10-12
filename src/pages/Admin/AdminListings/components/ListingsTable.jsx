import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatINR, formatDate } from '../../../../utils';
import { StatusBadge, DataTable } from '../../../../components/Admin/AdminUi';
import { adminApi } from '../../../../api/adminData';

const COLUMNS = [
  { key: 'listing',     label: 'Listing' },
  { key: 'contributor', label: 'Contributor' },
  { key: 'category',    label: 'Category' },
  { key: 'location',    label: 'Location' },
  { key: 'price',       label: 'Price' },
  { key: 'submitted',   label: 'Submitted' },
  { key: 'availability', label: 'Availability', className: 'w-px whitespace-nowrap' },
  { key: 'status',      label: 'Status',      className: 'w-px whitespace-nowrap' },
  { key: 'action',      label: 'Action',      className: 'w-px whitespace-nowrap text-right' },
];

function renderListingRow(l, contributorName, category, isUnseen, onOpenListing, onUpdateAvailability, updatingAvailability, onDeleteListing) {
  const unseen = isUnseen(l._id || l.id);
  const title = l.title || l.brand || 'Untitled';
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
    <td key="listing">
      <Link
        to={`/admin/listings/${l._type}/${l._id}`}
        onClick={() => onOpenListing?.(l)}
        className={`group/link font-medium hover:text-brand-blue transition-colors ${
          unseen ? 'text-brand-blue font-semibold' : 'text-slate-800'
        }`}
        title={title}
      >
        {unseen && (
          <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            <i className="fa-solid fa-circle text-[6px]" aria-hidden="true" />
            New
          </span>
        )}
        <span className="block">
          {title.length > 40 ? `${title.substring(0, 40)}…` : title}
        </span>
      </Link>
    </td>,

    /* Contributor */
    <td key="contributor" className="font-medium text-slate-600">
      {contributorName || '—'}
    </td>,

    /* Category */
    <td key="category">
      <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold capitalize text-slate-600">
        {category?.label || l._type}
      </span>
    </td>,

    /* Location */
    <td key="location" className="text-slate-600 whitespace-nowrap">
      {l.location || l.area || l.city || '—'}
    </td>,

    /* Price */
    <td key="price" className="font-bold whitespace-nowrap">
      {formatINR(l.price, { compact: true }) || '—'}
    </td>,

    /* Submitted */
    <td key="submitted" className="text-slate-500 whitespace-nowrap">
      {formatDate(l.createdAt)}
    </td>,

    /* Availability — single status / toggle button */
    <td key="availability">
      <button
        type="button"
        onClick={handleToggle}
        disabled={updatingAvailability === l._id || updatingAvailability === l.id}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize whitespace-nowrap shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 ${
          isSoldOut
            ? 'bg-red-50 text-red-600 border-red-200/70 hover:bg-red-100'
            : 'bg-emerald-50 text-emerald-600 border-emerald-200/70 hover:bg-emerald-100'
        }`}
        title={isSoldOut ? 'Click to mark as Available' : 'Click to mark as Sold Out'}
      >
        {updatingAvailability === l._id || updatingAvailability === l.id ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin text-[9px]" aria-hidden="true" />
            Updating…
          </>
        ) : isSoldOut ? (
          <>
            <i className="fa-solid fa-circle-xmark text-[9px]" aria-hidden="true" />
            Sold Out
          </>
        ) : (
          <>
            <i className="fa-solid fa-circle-check text-[9px]" aria-hidden="true" />
            Available
          </>
        )}
      </button>
    </td>,

    /* Status */
    <td key="status">
      <StatusBadge status={l.status} />
    </td>,

    /* Action (Delete) */
    <td key="action" className="text-right whitespace-nowrap">
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-colors"
        title="Delete listing"
        aria-label="Delete listing"
      >
        <i className="fa-solid fa-trash-can text-xs" aria-hidden="true" />
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
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const [updatingAvailability, setUpdatingAvailability] = React.useState(null);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
  const effectivePage = page > totalPages ? totalPages : page;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
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
          )
        }
        getRowClassName={(l) =>
          isUnseen(l._id || l.id)
            ? 'bg-brand-blue/[0.06] border-l-4 border-l-brand-blue'
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

      {/* Pagination info already shown inside DataTable */}
    </div>
  );
}
