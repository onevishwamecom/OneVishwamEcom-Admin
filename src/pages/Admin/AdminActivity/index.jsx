import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../../utils';
import { DataTable } from '../../../components/Admin/AdminUi';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { ActivitySkeleton, ErrorState } from '../../../components/skeleton';

const COLUMNS = [
  { key: 'action',      label: 'Action', className: 'w-px whitespace-nowrap' },
  { key: 'listing',     label: 'Listing' },
  { key: 'contributor', label: 'Contributor' },
  { key: 'note',        label: 'Note' },
  { key: 'time',        label: 'Time', className: 'w-px whitespace-nowrap' },
];

const ACTION_LABEL = {
  approved:           'Approved',
  pending:            'Pending Review',
  'changes-requested':'Changes Requested',
  'changes-required': 'Changes Requested',
  cancelled:          'Cancelled',
  'price-updated':    'Price Updated',
  updated:            'Updated',
  submitted:          'Submitted',
  active:             'Live',
};

const ACTION_META = {
  approved:           { icon: 'fa-circle-check',      tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  pending:            { icon: 'fa-hourglass-half',    tone: 'text-amber-700 bg-amber-50 border-amber-200' },
  'changes-requested':{ icon: 'fa-pen-to-square',     tone: 'text-violet-700 bg-violet-50 border-violet-200' },
  'changes-required': { icon: 'fa-pen-to-square',     tone: 'text-violet-700 bg-violet-50 border-violet-200' },
  cancelled:           { icon: 'fa-ban',               tone: 'text-rose-700 bg-rose-50 border-rose-200' },
  'price-updated':     { icon: 'fa-indian-rupee-sign', tone: 'text-blue-700 bg-blue-50 border-blue-200' },
  updated:            { icon: 'fa-pen',               tone: 'text-blue-700 bg-blue-50 border-blue-200' },
  submitted:          { icon: 'fa-paper-plane',       tone: 'text-blue-700 bg-blue-50 border-blue-200' },
  active:             { icon: 'fa-circle-check',      tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

function getActivityMeta(action) {
  return ACTION_META[action] || { icon: 'fa-circle-info', tone: 'text-slate-600 bg-slate-50 border-slate-200' };
}

function AdminActivity() {
  const { data: activity, loading, error, retry } = useAsyncData(
    () => adminApi.getActivity(),
    [],
    [],
    { cacheKey: 'activity', ttl: CACHE_TTL.activity },
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredActivity = useMemo(() => {
    const list = activity || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase().trim();
    return list.filter((entry) => {
      const title = (entry.listingTitle || entry.title || '').toLowerCase();
      const contributor = (entry.contributorName || '').toLowerCase();
      const note = (entry.note || '').toLowerCase();
      const action = (entry.action || '').toLowerCase();
      const actionLabel = (ACTION_LABEL[entry.action] || '').toLowerCase();
      return (
        title.includes(q) ||
        contributor.includes(q) ||
        note.includes(q) ||
        action.includes(q) ||
        actionLabel.includes(q)
      );
    });
  }, [activity, search]);

  const totalPages = Math.max(1, Math.ceil(filteredActivity.length / rowsPerPage));
  const effectivePage = page > totalPages ? totalPages : page;

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  if (loading) {
    return (
      <PageContainer>
        <ActivitySkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load activity"
          message="The activity feed could not be fetched. Please try again."
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Activity"
        description="Latest listing review actions and audit trail"
      />

      <DataTable
        columns={COLUMNS}
        rows={filteredActivity}
        page={effectivePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search activity by listing title, contributor or action…"
        emptyIcon="fa-clock-rotate-left"
        emptyTitle="No activity yet"
        emptyMessage={
          search
            ? 'No activity matches your search query.'
            : 'Actions you take in the console will show up here.'
        }
        renderRow={(entry) => {
          const actionKey = entry.action || entry.status || 'updated';
          const meta = getActivityMeta(actionKey);
          const label = ACTION_LABEL[actionKey] || actionKey;
          const title = entry.listingTitle || entry.title || 'Untitled listing';

          return [
            /* Action badge */
            <td key="action" className="whitespace-nowrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${meta.tone}`}
              >
                <i className={`fa-solid ${meta.icon} text-[9px]`} aria-hidden="true" />
                {label}
              </span>
            </td>,

            /* Listing title with link to detail */
            <td key="listing" className="font-semibold text-slate-800 max-w-[220px] truncate">
              {entry._type && (entry._id || entry.id) ? (
                <Link
                  to={`/admin/listings/${entry._type}/${entry._id || entry.id}`}
                  className="hover:text-brand-blue hover:underline transition-colors block truncate"
                  title={title}
                >
                  {title}
                </Link>
              ) : (
                <span className="block truncate" title={title}>
                  {title}
                </span>
              )}
            </td>,

            /* Contributor */
            <td key="contributor" className="text-slate-600 whitespace-nowrap">
              {entry.contributorName || '—'}
            </td>,

            /* Note */
            <td key="note" className="text-slate-500 italic max-w-[260px] truncate">
              {entry.note ? `"${entry.note}"` : <span className="text-slate-300 not-italic">—</span>}
            </td>,

            /* Time */
            <td key="time" className="text-slate-400 text-xs whitespace-nowrap">
              {formatTimeAgo(entry.createdAt)}
            </td>,
          ];
        }}
      />
    </PageContainer>
  );
}

export default AdminActivity;