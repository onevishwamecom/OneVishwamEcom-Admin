import { formatDate } from '../../../../utils';
import Field from './Field';

export default function ContributorInfoCard({ contributor, contributorDetail, contributedCount }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 h-fit space-y-4">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
        <i className="fa-solid fa-user-tie text-brand-blue" aria-hidden="true" />
        Contributor Information
      </h3>

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/80 flex items-center justify-center text-white text-xl font-extrabold shadow-sm shrink-0">
          {(contributor?.name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate">{contributor?.name || 'Unknown contributor'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Field label="Email" value={contributor?.email} />
        <Field label="Contact" value={contributor?.contact} />
        <Field label="City" value={contributor?.city} />
        <Field label="Joined" value={formatDate(contributor?.createdAt)} />
      </div>

      <div className="rounded-2xl bg-brand-blue/5 border border-brand-blue/15 p-4 text-center">
        <p className="text-2xl font-extrabold text-brand-blue">{contributedCount}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
          Total contributed listings
        </p>
        {contributorDetail && (
          <p className="text-[11px] font-semibold text-slate-500 mt-2">
            {contributorDetail.approvedListings} approved · {contributorDetail.pendingListings} pending
          </p>
        )}
      </div>
    </div>
  );
}