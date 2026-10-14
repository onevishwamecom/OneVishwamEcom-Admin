import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, DataTable } from '../../../components/Admin/AdminUi';
import { PageContainer, PageHeader, PageSection } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { CategoriesSkeleton, ErrorState } from '../../../components/skeleton';

const COLUMNS = [
  { key: 'category',  label: 'Category' },
  { key: 'total',     label: 'Total',            align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'pending',   label: 'Pending',           align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'approved',  label: 'Approved',          align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'changes',   label: 'Changes Required',  align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'cancelled', label: 'Cancelled',         align: 'center', className: 'w-px whitespace-nowrap' },
];

function AdminCategories() {
  const { data: categories, loading, error, retry } = useAsyncData(
    () => adminApi.getCategories(),
    [],
    [],
    { cacheKey: 'categories', ttl: CACHE_TTL.categories },
  );
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(categories.length / rowsPerPage));
  const effectivePage = page > totalPages ? totalPages : page;

  if (loading) {
    return (
      <PageContainer>
        <CategoriesSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load categories"
          message="Category data could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        description="Listing health across every OneVishwam sector"
      />

      {categories.length === 0 ? (
        <EmptyState icon="fa-table-cells-large" title="No categories" message="No category data available." />
      ) : (
        <>
          {/* Sector Breakdown Table */}
          <PageSection>
            <div className="px-1 pb-3">
              <h2 className="text-base font-bold text-slate-700">Sector Breakdown</h2>
            </div>
            <DataTable
              columns={COLUMNS}
              rows={categories}
              page={effectivePage}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              emptyIcon="fa-table-cells-large"
              emptyTitle="No categories"
              emptyMessage="No category data available."
              renderRow={(cat) => [
                /* Category name */
                <td key="category">
                  <Link
                    to={`/admin/approved-items/${cat.id}`}
                    className="inline-flex items-center gap-2 font-bold text-slate-800 hover:text-brand-blue transition-colors"
                  >
                    <i className={`fa-solid ${cat.icon} text-brand-blue`} aria-hidden="true" />
                    {cat.label}
                  </Link>
                </td>,

                /* Total */
                <td key="total" className="text-center font-semibold text-slate-700">
                  {cat.total}
                </td>,

                /* Pending */
                <td key="pending" className="text-center">
                  <Link
                    to={`/admin/listings?category=${cat.id}&status=pending`}
                    className="font-semibold text-amber-600 hover:underline"
                  >
                    {cat.pending}
                  </Link>
                </td>,

                /* Approved */
                <td key="approved" className="text-center">
                  <Link
                    to={`/admin/listings?category=${cat.id}&status=approved`}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {cat.approved}
                  </Link>
                </td>,

                /* Changes Required */
                <td key="changes" className="text-center">
                  <Link
                    to={`/admin/listings?category=${cat.id}&status=changes-required`}
                    className="font-semibold text-brand-orange hover:underline"
                  >
                    {cat.changesRequired}
                  </Link>
                </td>,

                /* Cancelled */
                <td key="cancelled" className="text-center">
                  <Link
                    to={`/admin/listings?category=${cat.id}&status=cancelled`}
                    className="font-semibold text-rose-500 hover:underline"
                  >
                    {cat.cancelled}
                  </Link>
                </td>,
              ]}
            />
          </PageSection>
        </>
      )}
    </PageContainer>
  );
}

export default AdminCategories;