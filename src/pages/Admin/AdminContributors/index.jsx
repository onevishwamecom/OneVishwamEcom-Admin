import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { DataTable, StatusBadge } from '../../../components/Admin/AdminUi';
import { formatINR } from '../../../utils';
import { PageContainer, PageHeader, PageSection } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { ContributorsSkeleton, ErrorState } from '../../../components/skeleton';

const COLUMNS = [
  { key: 'name',      label: 'Contributor' },
  { key: 'contact',   label: 'Contact' },
  { key: 'total',     label: 'Total',     align: 'center' },
  { key: 'pending',   label: 'Pending',   align: 'center' },
  { key: 'approved',  label: 'Approved',  align: 'center' },
  { key: 'changes',   label: 'Changes',   align: 'center' },
  { key: 'cancelled', label: 'Cancelled', align: 'center' },
];

const MODAL_COLUMNS = [
  { key: 'listing', label: 'Listing Title' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'status', label: 'Status', align: 'center' }
];

function ContributorModal({ contributor, onClose }) {
  const { data, loading } = useAsyncData(
    () => adminApi.getContributorDetail(contributor?.id),
    [contributor?.id],
    null,
    { cacheKey: `contributor:${contributor?.id}`, ttl: CACHE_TTL.detail },
  );

  if (!contributor) return null;

  const contributorListings = data?.items || [];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Contributor Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Info Section */}
          <div className="flex items-center gap-5 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white text-3xl font-extrabold shadow-sm shrink-0">
              {contributor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{contributor.name}</h3>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2 font-medium">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <i className="fa-solid fa-phone text-slate-400"></i>
                  </div>
                  {contributor.contact || '—'}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <i className="fa-solid fa-envelope text-slate-400"></i>
                  </div>
                  {contributor.email || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800">Contributions ({contributorListings.length})</h4>
          </div>
          
          <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="px-6 py-8 text-center text-sm font-medium text-slate-400">
                Loading contributions…
              </div>
            ) : (
            <DataTable 
              columns={MODAL_COLUMNS}
              rows={contributorListings}
              emptyIcon="fa-box-open"
              emptyTitle="No contributions"
              emptyMessage="This user hasn't submitted any listings yet."
              renderRow={(l) => [
                <td key="title" className="font-medium text-slate-800 w-1/2">
                  <Link to={`/admin/listings/${l._type}/${l._id || l.id}`} className="hover:text-brand-blue transition-colors group">
                    <span className="block truncate">{l.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-brand-blue/70">ID: {l._id || l.id}</span>
                  </Link>
                </td>,
                <td key="category" className="text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                    {l._type}
                  </span>
                </td>,
                <td key="price" className="font-bold text-slate-700 whitespace-nowrap">
                  {formatINR(l.price, { compact: true }) || '—'}
                </td>,
                <td key="status" className="text-center w-px whitespace-nowrap">
                  <StatusBadge status={l.status} />
                </td>
              ]}
            />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function AdminContributors() {
  const { data: contributors, loading, error, retry } = useAsyncData(
    () => adminApi.getContributors(),
    [],
    [],
    { cacheKey: 'contributors', ttl: CACHE_TTL.listings },
  );
  const [selectedContributor, setSelectedContributor] = useState(null);

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
        {contributors.map((c) => (
          <div key={c._id || c.id} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover-lift p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white font-extrabold shadow-sm shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <button
                  onClick={() => setSelectedContributor(c)}
                  className="font-bold text-slate-900 truncate hover:text-brand-blue transition-colors focus:outline-none"
                >
                  {c.name}
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-500">
                <i className="fa-solid fa-phone text-slate-300 text-xs" aria-hidden="true" />
                {c.contact || '—'}
              </p>
              <p className="flex items-center gap-2 text-slate-500 truncate">
                <i className="fa-solid fa-envelope text-slate-300 text-xs" aria-hidden="true" />
                {c.email || '—'}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 py-2">
                <p className="text-sm font-extrabold text-slate-900">{c.totalListings}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total</p>
              </div>
              <div className="rounded-xl bg-emerald-50 py-2">
                <p className="text-sm font-extrabold text-emerald-600">{c.approvedListings}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600/70">Approved</p>
              </div>
              <div className="rounded-xl bg-amber-50 py-2">
                <p className="text-sm font-extrabold text-amber-700">{c.pendingListings}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600/70">Pending</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All Contributors table */}
      <PageSection>
        <div className="px-1 pb-3">
          <h2 className="text-base font-bold text-slate-700">All Contributors</h2>
        </div>
        <DataTable
          columns={COLUMNS}
          rows={contributors}
          emptyIcon="fa-users"
          emptyTitle="No contributors"
          emptyMessage="No contributor data is available yet."
          renderRow={(c) => [
            /* Name */
            <td key="name">
              <button
                onClick={() => setSelectedContributor(c)}
                className="font-bold text-slate-800 hover:text-brand-blue transition-colors focus:outline-none"
              >
                {c.name}
              </button>
            </td>,

            /* Contact */
            <td key="contact" className="text-slate-600">
              {c.contact || '—'}
            </td>,

            /* Total */
            <td key="total" className="text-center font-extrabold text-slate-900">
              {c.totalListings}
            </td>,

            /* Pending */
            <td key="pending" className="text-center font-semibold text-amber-700">
              {c.pendingListings}
            </td>,

            /* Approved */
            <td key="approved" className="text-center font-semibold text-emerald-600">
              {c.approvedListings}
            </td>,

            /* Changes */
            <td key="changes" className="text-center font-semibold text-brand-orange">
              {c.changesRequired}
            </td>,

            /* Cancelled */
            <td key="cancelled" className="text-center font-semibold text-rose-500">
              {c.cancelledListings}
            </td>,
          ]}
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