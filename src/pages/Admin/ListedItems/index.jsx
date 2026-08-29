import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-400 border-b-2 border-slate-100">
                  <th className="px-4 py-3.5 font-medium whitespace-nowrap w-12 bg-slate-50 text-center">
                    #
                  </th>
                  <th className="px-5 py-3.5 font-medium whitespace-nowrap bg-slate-50">Product</th>
                  <th className="px-5 py-3.5 font-medium whitespace-nowrap bg-slate-50">Category</th>
                  <th className="px-5 py-3.5 font-medium whitespace-nowrap bg-slate-50">Price</th>
                  <th className="px-5 py-3.5 font-medium whitespace-nowrap bg-slate-50">Location</th>
                  <th className="px-5 py-3.5 font-medium whitespace-nowrap bg-slate-50">Date</th>
                  <th className="px-5 py-3.5 font-medium whitespace-nowrap bg-slate-50 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((l, ri) => {
                  const cat = categories.find((c) => c.id === l._type);
                  const isEvenRow = ri % 2 === 1;
                  return (
                    <tr
                      key={l._id || l.id}
                      className={`border-b border-slate-100 last:border-0 transition-colors ${
                        isEvenRow ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center text-xs font-bold text-slate-300 select-none tabular-nums bg-slate-50">
                        {(effectivePage - 1) * rowsPerPage + ri + 1}
                      </td>

                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/admin/listings/${l._type}/${l._id || l.id}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="h-11 w-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
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
                                <i className={`fa-solid ${cat?.icon || 'fa-box-open'} text-sm`} aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 group-hover:text-brand-blue transition-colors truncate">
                              {l.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-normal">
                              {l._id || l.id}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          <i className={`fa-solid ${cat?.icon || 'fa-box-open'} text-brand-blue`} aria-hidden="true" />
                          {cat?.label || l._type}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 font-bold text-slate-700 whitespace-nowrap">
                        {formatINR(l.price, { compact: true }) || '—'}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {l.location || l.area || l.city || '—'}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(l.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(l)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 px-3 py-1.5 text-sm font-bold hover:bg-rose-100 transition-colors"
                            aria-label={`Delete ${l.title}`}
                          >
                            <i className="fa-solid fa-trash-can text-[10px]" aria-hidden="true" />
                          </button>
                        </div>
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
    </PageContainer>
  );
}