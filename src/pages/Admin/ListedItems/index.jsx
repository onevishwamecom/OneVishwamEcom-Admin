import { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatINR, formatDate } from '../../../utils';
import { EmptyState, DataTable } from '../../../components/Admin/AdminUi';
import CategoryBadge from '../../../components/ui/CategoryBadge';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { Skeleton, SkeletonTable, ErrorState } from '../../../components/skeleton';
import EditListingModal from './components/EditListingModal';

function ListedItemsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-48" rounded="rounded-lg" />
        <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />
      </div>

      {/* Category pills skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0" rounded="rounded-xl" />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-3 border-b border-slate-100/60 flex items-center gap-2">
          <Skeleton className="h-8 flex-1" rounded="rounded-md" />
        </div>
        <SkeletonTable
          rows={8}
          columns={6}
          showIndex={true}
          action={true}
          headers={['Product', 'Category', 'Price', 'Location', 'Date', 'Stock']}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  );
}

function renderApprovedRow(
  l,
  handleDelete,
  handleToggleStock,
  updatingAvailability,
  handleHoverItem,
  currentPage,
  location
) {
  const title = l.title || l.brand || l.name || 'Untitled';
  const locationText = [l.area, l.city].filter(Boolean).join(', ') || l.location || l.city || l.area || '—';
  const availability = l.availabilityStatus || 'available';
  const isSoldOut = availability === 'sold_out';

  const onToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleStock(l, isSoldOut ? 'available' : 'sold_out');
  };

  const onDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDelete(l);
  };

  return [
    /* Listing / Product title */
    <td key="listing" className="min-w-[140px] max-w-[220px] overflow-hidden">
      <Link
        to={`/admin/listings/${l._type}/${l._id || l.id}`}
        state={{
          fromPage: currentPage,
          fromPath: location ? `${location.pathname}${location.search}` : undefined,
        }}
        onClick={() => {
          try {
            sessionStorage.setItem('admin_listings_page', String(currentPage));
          } catch (e) {}
        }}
        className="group/link font-semibold hover:text-brand-blue transition-colors flex items-center gap-2 min-w-0"
      >
        <span
          onMouseEnter={(e) => handleHoverItem?.(title, e.currentTarget)}
          onMouseLeave={() => handleHoverItem?.(null)}
          className="truncate block min-w-0 max-w-[200px] font-semibold text-xs text-slate-800 group-hover/link:text-brand-blue cursor-pointer"
        >
          {title}
        </span>
      </Link>
    </td>,

    /* Category */
    <td key="category" className="w-24 min-w-[95px] whitespace-nowrap">
      <CategoryBadge category={l._type || l.category} compact />
    </td>,

    /* Price */
    <td key="price" className="font-bold text-slate-800 whitespace-nowrap text-xs tabular-nums w-20">
      {formatINR(l.numericPrice || l.priceValue || l.price, { compact: true }) || '—'}
    </td>,

    /* Location */
    <td key="location" className="text-slate-500 max-w-[130px] truncate text-xs w-28">
      <span
        onMouseEnter={(e) => handleHoverItem?.(locationText, e.currentTarget)}
        onMouseLeave={() => handleHoverItem?.(null)}
        className="truncate block max-w-[125px] cursor-pointer hover:text-slate-800 transition-colors"
      >
        {locationText}
      </span>
    </td>,

    /* Date */
    <td key="date" className="text-slate-400 text-[11px] tabular-nums whitespace-nowrap w-20">
      {formatDate(l.createdAt || l.date)}
    </td>,

    /* Stock */
    <td key="stock" className="w-24 whitespace-nowrap">
      <button
        type="button"
        onClick={onToggle}
        disabled={updatingAvailability === (l._id || l.id)}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xs cursor-pointer ${
          isSoldOut
            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
        }`}
        title={isSoldOut ? 'Sold Out — Click to mark In Stock' : 'In Stock — Click to mark Sold Out'}
      >
        {updatingAvailability === (l._id || l.id) ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin text-[8px] text-slate-400" aria-hidden="true" />
            <span className="text-slate-500">Updating…</span>
          </>
        ) : isSoldOut ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Sold Out</span>
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span>In Stock</span>
          </>
        )}
      </button>
    </td>,

    /* Action (Delete only, NO View button) */
    <td key="action" className="text-right w-10 whitespace-nowrap">
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs"
        title="Delete product"
        aria-label="Delete product"
      >
        <i className="fa-solid fa-trash-can text-[10px]" aria-hidden="true" />
      </button>
    </td>,
  ];
}

export default function ListedItems() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [updatingAvailability, setUpdatingAvailability] = useState(null);
  const [editing, setEditing] = useState(null);
  const [hoverPill, setHoverPill] = useState(null);

  const rowsPerPage = 10;

  const page = useMemo(() => {
    const fromParams = parseInt(searchParams.get('page'), 10);
    if (!isNaN(fromParams) && fromParams > 0) return fromParams;
    try {
      const fromStorage = parseInt(sessionStorage.getItem('admin_listings_page'), 10);
      if (!isNaN(fromStorage) && fromStorage > 0) return fromStorage;
    } catch (e) {}
    return 1;
  }, [searchParams]);

  const setPage = (newPageOrFn) => {
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
  };

  const prevSearchRef = useRef(searchQuery);
  useEffect(() => {
    if (prevSearchRef.current === searchQuery) return;
    prevSearchRef.current = searchQuery;
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'title' ? 'asc' : 'desc');
    }
    setPage(1);
  };

  const handleHoverItem = (text, targetElement) => {
    if (!text || text === '—' || !targetElement) {
      setHoverPill(null);
      return;
    }
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

  useEffect(() => {
    if (!hoverPill) return;
    const hidePill = () => setHoverPill(null);
    window.addEventListener('scroll', hidePill, true);
    window.addEventListener('resize', hidePill);
    return () => {
      window.removeEventListener('scroll', hidePill, true);
      window.removeEventListener('resize', hidePill);
    };
  }, [hoverPill]);

  const { data: listings, loading, error, retry } = useAsyncData(
    () => adminApi.getListings(),
    [],
    [],
    { cacheKey: 'listings', ttl: CACHE_TTL.listings },
  );

  const { data: categories } = useAsyncData(
    () => adminApi.getCategories(),
    [],
    [],
    { cacheKey: 'categories', ttl: CACHE_TTL.categories },
  );

  const activeCategory = categories.find((c) => c.id === category) || null;
  const editingCategory = categories.find((c) => c.id === editing?._type) || null;

  const approved = useMemo(
    () =>
      listings
        .filter((l) => l.status === 'approved')
        .filter((l) => (category ? l._type === category : true)),
    [listings, category],
  );

  const filtered = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    return approved.filter((l) => {
      if (!q) return true;
      const title = (l.title || l.brand || l.name || '').toLowerCase();
      const loc = (l.location || l.city || l.area || '').toLowerCase();
      const cat = (l._type || l.category || '').toLowerCase();
      return title.includes(q) || loc.includes(q) || cat.includes(q);
    });
  }, [approved, debouncedSearchQuery]);

  const sortedAndFiltered = useMemo(() => {
    const list = [...filtered];
    if (!sortField) return list;
    return list.sort((a, b) => {
      let diff = 0;
      if (sortField === 'title') {
        const tA = (a.title || a.brand || a.name || '').toLowerCase();
        const tB = (b.title || b.brand || b.name || '').toLowerCase();
        diff = tA.localeCompare(tB);
      } else if (sortField === 'price') {
        const pA = Number(a.numericPrice || a.priceValue || a.price) || 0;
        const pB = Number(b.numericPrice || b.priceValue || b.price) || 0;
        diff = pA - pB;
      } else if (sortField === 'date') {
        const dA = new Date(a.createdAt || a.date || 0).getTime();
        const dB = new Date(b.createdAt || b.date || 0).getTime();
        diff = dA - dB;
      }
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [filtered, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedAndFiltered.length / rowsPerPage));
  const effectivePage = sortedAndFiltered.length > 0 && page > totalPages ? totalPages : page;

  const handleRowClick = (l) => {
    try {
      sessionStorage.setItem('admin_listings_page', String(effectivePage));
    } catch (e) {}
    navigate(`/admin/listings/${l._type}/${l._id || l.id}`, {
      state: {
        fromPage: effectivePage,
        fromPath: location ? `${location.pathname}${location.search}` : undefined,
      },
    });
  };

  const columns = useMemo(() => [
    {
      key: 'listing',
      label: 'Product',
      className: 'min-w-[140px] max-w-[220px]',
      header: () => (
        <button
          type="button"
          onClick={() => handleSort('title')}
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500 hover:text-brand-blue cursor-pointer select-none group/sort"
          title="Sort by Title"
        >
          <span>Product</span>
          <i
            className={`text-[9px] ${
              sortField === 'title'
                ? 'text-brand-blue ' + (sortOrder === 'asc' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down')
                : 'text-slate-300 group-hover/sort:text-slate-400 fa-solid fa-sort'
            }`}
            aria-hidden="true"
          />
        </button>
      ),
    },
    { key: 'category', label: 'Category', className: 'w-24 min-w-[95px] whitespace-nowrap' },
    {
      key: 'price',
      label: 'Price',
      className: 'w-20 whitespace-nowrap',
      header: () => (
        <button
          type="button"
          onClick={() => handleSort('price')}
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500 hover:text-brand-blue cursor-pointer select-none group/sort"
          title="Sort by Price"
        >
          <span>Price</span>
          <i
            className={`text-[9px] ${
              sortField === 'price'
                ? 'text-brand-blue ' + (sortOrder === 'asc' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down')
                : 'text-slate-300 group-hover/sort:text-slate-400 fa-solid fa-sort'
            }`}
            aria-hidden="true"
          />
        </button>
      ),
    },
    { key: 'location', label: 'Location', className: 'w-28 max-w-[130px]' },
    {
      key: 'date',
      label: 'Date',
      className: 'w-20 whitespace-nowrap',
      header: () => (
        <button
          type="button"
          onClick={() => handleSort('date')}
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500 hover:text-brand-blue cursor-pointer select-none group/sort"
          title="Sort by Date"
        >
          <span>Date</span>
          <i
            className={`text-[9px] ${
              sortField === 'date'
                ? 'text-brand-blue ' + (sortOrder === 'asc' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down')
                : 'text-slate-300 group-hover/sort:text-slate-400 fa-solid fa-sort'
            }`}
            aria-hidden="true"
          />
        </button>
      ),
    },
    { key: 'stock',  label: 'Stock',  className: 'w-24 whitespace-nowrap' },
    { key: 'action', label: 'Action', className: 'w-10 whitespace-nowrap text-right' },
  ], [sortField, sortOrder]);

  const reloadListings = () => {
    retry();
  };

  const handleDelete = async (l) => {
    const title = l.title || l.brand || l.name || 'Untitled';
    const { isConfirmed } = await Swal.fire({
      title: 'Delete this product?',
      text: `"${title}" will be permanently removed from the live site.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-4 py-2 font-bold text-sm',
        cancelButton: 'rounded-xl px-4 py-2 font-bold text-sm',
      },
    });
    if (isConfirmed) {
      await adminApi.deleteListing(l._type, l._id || l.id);
      await reloadListings();
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'The product has been removed.',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' },
      });
    }
  };

  const handleToggleAvailability = async (l, newStatus) => {
    if (l.availabilityStatus === newStatus) return;
    const actionText = newStatus === 'sold_out' ? 'Sold Out' : 'In Stock';
    const result = await Swal.fire({
      title: `Mark as ${actionText}?`,
      text: newStatus === 'sold_out'
        ? 'Are you sure you want to mark this listing as Sold Out?'
        : 'Are you sure you want to mark this listing as In Stock?',
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

    const id = l._id || l.id;
    setUpdatingAvailability(id);
    try {
      await adminApi.updateAvailabilityStatus(l._type, id, newStatus);
      await reloadListings();
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Listing is now marked as ${actionText}.`,
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' },
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update stock status.',
        customClass: { popup: 'rounded-2xl' },
      });
    } finally {
      setUpdatingAvailability(null);
    }
  };

  const handleEditConfirm = async (form, images) => {
    await adminApi.updateListing(editing._type, editing._id || editing.id, {
      ...form,
      images,
      status: form.status && form.status !== 'pending' ? form.status : 'approved',
    });
    await reloadListings();
    setEditing(null);
    Swal.fire({
      icon: 'success',
      title: 'Saved',
      text: 'The product has been updated.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <ListedItemsSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load approved items"
          message="Approved listings could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={activeCategory ? activeCategory.label : 'Approved Items'}
        description={
          activeCategory
            ? `Approved ${activeCategory.label.toLowerCase()} listings live on OneVishwam`
            : 'All approved listings live on OneVishwam'
        }
      />

      {/* Category filter pills */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <Link
            to="/admin/approved-items"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              !category
                ? 'bg-brand-blue text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({listings.filter((l) => l.status === 'approved').length})
          </Link>
          {categories.map((cat) => {
            const catCount = listings.filter((l) => l.status === 'approved' && l._type === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/admin/approved-items/${cat.id}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  category === cat.id
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-xs`} aria-hidden="true" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${category === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {catCount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {approved.length === 0 ? (
        <EmptyState
          icon="fa-box-open"
          title="No approved listings"
          message="There are no approved listings in this category yet."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
          {/* Search / filter bar matching ListingsTable */}
          <div className="p-3 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search approved listings by title, location or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-150"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    aria-label="Clear search"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table matching ListingsTable design */}
          <DataTable
            columns={columns}
            rows={sortedAndFiltered}
            page={effectivePage}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowClick={handleRowClick}
            renderRow={(l) =>
              renderApprovedRow(
                l,
                handleDelete,
                handleToggleAvailability,
                updatingAvailability,
                handleHoverItem,
                effectivePage,
                location
              )
            }
            emptyIcon="fa-box-open"
            emptyTitle="No approved listings found"
            emptyMessage={
              searchQuery
                ? 'No listings match your search criteria.'
                : 'No approved listings found for the current filter.'
            }
            className="rounded-none border-0 shadow-none"
          />
        </div>
      )}

      <EditListingModal
        key={editing?._id || editing?.id || 'edit'}
        open={!!editing}
        onClose={() => setEditing(null)}
        listing={editing}
        category={editingCategory}
        onConfirm={handleEditConfirm}
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
    </PageContainer>
  );
}
