import { formatDate } from '../../../../utils';

export default function ProfileHeader({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white text-2xl font-extrabold shadow-sm shrink-0">
          {(data.name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.name}</h1>
          </div>
          <p className="text-slate-500 font-medium mt-1">
            {data.city || 'Bengaluru'} · Joined {formatDate(data.createdAt)}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-phone text-slate-300 text-xs" aria-hidden="true" />
              {data.phone || data.contact || '—'}
            </span>
            <span className="inline-flex items-center gap-2 truncate">
              <i className="fa-solid fa-envelope text-slate-300 text-xs" aria-hidden="true" />
              {data.email || '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}