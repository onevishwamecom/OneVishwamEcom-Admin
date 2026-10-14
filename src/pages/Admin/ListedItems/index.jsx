import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatINR, formatDate } from '../../../utils';
import { EmptyState } from '../../../components/Admin/AdminUi';
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
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0" rounded="rounded-full" />
        ))}
      </div>

      <SkeletonTable rows={8} columns={6} />
    </div>
  );
}

export default function ListedItems() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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
  const [editing, setEditing] = useState(null);
  const [hoverPill, setHoverPill] = useState(null);

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
  const rowsPerPage = 10;

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
        .filter((l) => (category ? l._type === category : true))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [listings, category],
  );

  const totalPages = Math.max(1, Math.ceil(approved.length / rowsPerPage));
  const effectivePage = page > totalPages ? totalPages : page;
  const pageItems = approved.slice((effectivePage - 1) * rowsPerPage, effectivePage * rowsPerPage);

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

  const reloadListings = () => {
    retry();
  };

  const handleDelete = async (l) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete this product?',
      text: `"${l.title}" will be permanently removed from the live site.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
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
      });
    }
  };

  const handleEditConfirm = async (form, images) => {
    await adminApi.updateListing(editing._type, editing._id || editing.id, {
      ...form,
      images,
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
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              !category
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/admin/approved-items/${cat.id}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                category === cat.id
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fa-solid ${cat.icon} text-xs`} aria-hidden="true" />
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {approved.length === 0 ? (
        <EmptyState
          icon="fa-box-open"
          title="No approved listings"
          message="There are no approved listings in this category yet."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto touch-pan-y w-full max-w-full">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-400 border-b-2 border-slate-100">
                  <th className="px-2 py-2 font-semibold text-[11px] whitespace-nowrap w-8 bg-slate-50 text-center text-slate-400">
                    #
                  </th>
                  <th className="px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50">Product</th>
                  <th className="px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50 w-px">Category</th>
                  <th className="px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50">Price</th>
                  <th className="px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50">Location</th>
                  <th className="px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50">Date</th>
                  <th className="px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50 text-right w-px">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((l, ri) => {
                  const cat = categories.find((c) => c.id === l._type);
                  const isEvenRow = ri % 2 === 1;
                  return (
                    <tr
                      key={l._id || l.id}
                      className={`border-b border-slate-100 last:border-0 transition-colors h-12 max-h-12 ${
                        isEvenRow ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      <td className="px-2 py-2 text-center text-[11px] font-bold text-slate-300 select-none tabular-nums bg-slate-50 align-middle">
                        {(effectivePage - 1) * rowsPerPage + ri + 1}
                      </td>

                      {/* Product */}
                      <td className="px-2.5 sm:px-3 py-1.5 max-w-[190px] overflow-hidden align-middle">
                        <Link
                          to={`/admin/listings/${l._type}/${l._id || l.id}`}
                          state={{
                            fromPage: effectivePage,
                            fromPath: `${location.pathname}${location.search}`,
                          }}
                          onClick={() => {
                            try {
                              sessionStorage.setItem('admin_listings_page', String(effectivePage));
                            } catch (e) {}
                          }}
                          className="group flex items-center gap-2 min-w-0"
                          title={l.title}
                        >
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {l.images && l.images.length > 0 && l.images[0] ? (
                              <img
                                src={l.images[0]}
                                alt={l.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <i className={`fa-solid ${cat?.icon || 'fa-box-open'} text-xs`} aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              onMouseEnter={(e) => handleHoverItem(l.title, e.currentTarget)}
                              onMouseLeave={() => handleHoverItem(null)}
                              className="font-semibold text-xs text-slate-800 group-hover:text-brand-blue transition-colors truncate max-w-[140px] sm:max-w-[170px] cursor-pointer"
                            >
                              {l.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">
                              {l._id || l.id}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="px-2.5 sm:px-3 py-1.5 w-px whitespace-nowrap align-middle">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          <i className={`fa-solid ${cat?.icon || 'fa-box-open'} text-brand-blue text-[9px]`} aria-hidden="true" />
                          {cat?.label || l._type}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-2.5 sm:px-3 py-1.5 font-bold text-slate-800 whitespace-nowrap text-xs align-middle">
                        {formatINR(l.price, { compact: true }) || '—'}
                      </td>

                      {/* Location */}
                      <td className="px-2.5 sm:px-3 py-1.5 text-slate-600 max-w-[110px] truncate text-xs align-middle">
                        <span
                          onMouseEnter={(e) => handleHoverItem(l.location || l.area || l.city, e.currentTarget)}
                          onMouseLeave={() => handleHoverItem(null)}
                          className="truncate block max-w-[110px] cursor-pointer hover:text-slate-900 transition-colors"
                        >
                          {l.location || l.area || l.city || '—'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-2.5 sm:px-3 py-1.5 text-slate-400 text-xs whitespace-nowrap align-middle">
                        {formatDate(l.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-2.5 sm:px-3 py-1.5 text-right w-px whitespace-nowrap align-middle">
                        <button
                          onClick={() => handleDelete(l)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          aria-label={`Delete ${l.title}`}
                          title="Delete listing"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100/60">
            <span className="text-sm text-slate-500">
              Showing {(effectivePage - 1) * rowsPerPage + 1} to{' '}
              {Math.min(effectivePage * rowsPerPage, approved.length)} of {approved.length} listings
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(effectivePage - 1)}
                disabled={effectivePage <= 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${
                    p === effectivePage
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'border border-slate-300 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(effectivePage + 1)}
                disabled={effectivePage >= totalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
              </button>
            </div>
          </div>
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