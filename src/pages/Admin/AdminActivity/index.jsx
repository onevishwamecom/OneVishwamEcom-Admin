import React from 'react';
import { formatTimeAgo } from '../../../utils';
import { DataTable } from '../../../components/Admin/AdminUi';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { ActivitySkeleton, ErrorState } from '../../../components/skeleton';

const COLUMNS = [
  { key: 'action',      label: 'Action' },
  { key: 'listing',     label: 'Listing' },
  { key: 'contributor', label: 'Contributor' },
  { key: 'note',        label: 'Note' },
  { key: 'time',        label: 'Time' },
];

const ACTION_LABEL = {
  approved:           'Approved',
  cancelled:          'Cancelled',
  'price-updated':    'Price Updated',
  'changes-requested':'Changes Requested',
  updated:            'Updated',
};

const ACTION_META = {
  approved: { icon: 'fa-circle-check', tone: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  'changes-requested': { icon: 'fa-pen-to-square', tone: 'text-amber-600 bg-amber-50 border-amber-200' },
  cancelled: { icon: 'fa-ban', tone: 'text-rose-600 bg-rose-50 border-rose-200' },
  updated: { icon: 'fa-pen', tone: 'text-blue-600 bg-blue-50 border-blue-200' },
  'price-updated': { icon: 'fa-indian-rupee-sign', tone: 'text-blue-600 bg-blue-50 border-blue-200' },
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
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(activity.length / rowsPerPage));
  const effectivePage = page > totalPages ? totalPages : page;

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
        rows={activity}
        page={effectivePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        emptyIcon="fa-clock-rotate-left"
        emptyTitle="No activity yet"
        emptyMessage="Actions you take in the console will show up here."
        renderRow={(entry) => {
          const meta = getActivityMeta(entry.action);
          return [
            /* Action badge */
            <td key="action">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${meta.tone}`}
              >
                <i className={`fa-solid ${meta.icon} text-[9px]`} aria-hidden="true" />
                {ACTION_LABEL[entry.action] || entry.action}
              </span>
            </td>,

            /* Listing title */
            <td key="listing" className="font-semibold text-slate-800 max-w-[220px] truncate">
              {entry.listingTitle || 'Unknown listing'}
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