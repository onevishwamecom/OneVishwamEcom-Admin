import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, StatusBadge } from '../../../components/Admin/AdminUi';
import { formatINR } from '../../../utils';
import { PageContainer, PageHeader, PageSection } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { ContributorsSkeleton, ErrorState } from '../../../components/skeleton';
import { Button } from '../../../components/ui';
import ContributorModal from './components/ContributorModal';

const COLUMNS = [
  { key: 'name',      label: 'Contributor' },
  { key: 'contact',   label: 'Contact' },
  { key: 'total',     label: 'Total',     align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'pending',   label: 'Pending',   align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'approved',  label: 'Approved',  align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'changes',   label: 'Changes',   align: 'center', className: 'w-px whitespace-nowrap' },
  { key: 'cancelled', label: 'Cancelled', align: 'center', className: 'w-px whitespace-nowrap' },
];

function AdminContributors() {
  const { data: contributors, loading, error, retry } = useAsyncData(
    () => adminApi.getContributors(),
    [],
    [],
    { cacheKey: 'contributors', ttl: CACHE_TTL.listings },
  );
  const [selectedContributor, setSelectedContributor] = useState(null);

  const uniqueContributors = useMemo(() => {
    const seen = new Set();
    return (contributors || []).filter((c) => {
      const key = (c.email || c.name || String(c.id || c._id || '')).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [contributors]);

  if (loading) {
    return (
      <PageContainer>
        <ContributorsSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load contributors"
          message="Contributor data could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Contributors"
        description="Contributors and their activity on OneVishwam"
      />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {uniqueContributors.map((c) => {
          const contribId = c._id || c.id;
          return (
            <div key={contribId} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover-lift p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white font-extrabold shadow-sm shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/admin/contributors/${encodeURIComponent(contribId)}`}
                      className="font-bold text-slate-900 truncate hover:text-brand-blue transition-colors group flex items-center gap-1.5"
                    >
                      <span className="truncate group-hover:underline">{c.name}</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 group-hover:text-brand-blue shrink-0" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-slate-600">
                    <i className="fa-solid fa-phone text-slate-400 text-xs shrink-0" aria-hidden="true" />
                    <span className="font-medium">{c.phone || c.contact || '—'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-600 truncate" title={c.email || ''}>
                    <i className="fa-solid fa-envelope text-slate-400 text-xs shrink-0" aria-hidden="true" />
                    <span className="truncate">{c.email || '—'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 py-2">
                  <p className="text-sm font-extrabold text-slate-900">{c.totalListings ?? c.total ?? 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total</p>
                </div>
                <div className="rounded-xl bg-emerald-50 py-2">
                  <p className="text-sm font-extrabold text-emerald-600">{c.approvedListings ?? c.approvedCount ?? c.approved ?? 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600/70">Approved</p>
                </div>
                <div className="rounded-xl bg-amber-50 py-2">
                  <p className="text-sm font-extrabold text-amber-700">{c.pendingListings ?? c.pendingCount ?? c.pending ?? 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600/70">Pending</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Contributors table */}
      <PageSection>
        <div className="px-1 pb-3">
          <h2 className="text-base font-bold text-slate-700">All Contributors</h2>
        </div>
        <DataTable
          columns={COLUMNS}
          rows={uniqueContributors}
          emptyIcon="fa-users"
          emptyTitle="No contributors"
          emptyMessage="No contributor data is available yet."
          renderRow={(c) => {
            const contribId = c._id || c.id;
            return [
              /* Name with routing + quick view */
              <td key="name">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/contributors/${encodeURIComponent(contribId)}`}
                    className="font-bold text-slate-800 hover:text-brand-blue transition-colors group inline-flex items-center gap-1.5"
                  >
                    <span className="group-hover:underline">{c.name}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 group-hover:text-brand-blue" />
                  </Link>
                </div>
              </td>,

              /* Contact: Phone & Email */
              <td key="contact" className="text-slate-600">
                <div className="flex flex-col gap-0.5 text-xs py-0.5">
                  {(c.phone || c.contact) && (
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <i className="fa-solid fa-phone text-[10px] text-slate-400" />
                      {c.phone || c.contact}
                    </span>
                  )}
                  {c.email && (
                    <span className="flex items-center gap-1.5 text-slate-500 truncate max-w-[220px]" title={c.email}>
                      <i className="fa-solid fa-envelope text-[10px] text-slate-400" />
                      {c.email}
                    </span>
                  )}
                  {!c.phone && !c.contact && !c.email && <span>—</span>}
                </div>
              </td>,

              /* Total */
              <td key="total" className="text-center py-2.5">
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-extrabold">
                  {c.totalListings ?? c.total ?? 0}
                </span>
              </td>,

              /* Pending */
              <td key="pending" className="text-center py-2.5">
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-bold">
                  {c.pendingListings ?? c.pendingCount ?? c.pending ?? 0}
                </span>
              </td>,

              /* Approved */
              <td key="approved" className="text-center py-2.5">
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-bold">
                  {c.approvedListings ?? c.approvedCount ?? c.approved ?? 0}
                </span>
              </td>,

              /* Changes */
              <td key="changes" className="text-center py-2.5">
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-orange-50 text-brand-orange text-xs font-bold">
                  {c.changesRequired ?? c.changesRequiredListings ?? 0}
                </span>
              </td>,

              /* Cancelled */
              <td key="cancelled" className="text-center py-2.5">
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-500 text-xs font-bold">
                  {c.cancelledListings ?? c.cancelledCount ?? c.cancelled ?? 0}
                </span>
              </td>,
            ];
          }}
        />
      </PageSection>

      {/* Modal */}
      {selectedContributor && (
        <ContributorModal 
          contributor={selectedContributor} 
          onClose={() => setSelectedContributor(null)} 
        />
      )}
    </PageContainer>
  );
}

export default AdminContributors;