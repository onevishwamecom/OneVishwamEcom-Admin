import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../../../components/Admin/AdminUi';

const COLUMNS = [
  { key: 'name', label: 'Contributor' },
  { key: 'contact', label: 'Contact' },
  { key: 'total', label: 'Total', align: 'center', className: 'text-center' },
  { key: 'pending', label: 'Pending', align: 'center', className: 'text-center' },
  { key: 'approved', label: 'Approved', align: 'center', className: 'text-center' },
  { key: 'cancelled', label: 'Cancelled', align: 'center', className: 'text-center' },
];

export default function ContributorsTable({ contributors = [] }) {
  const uniqueRows = useMemo(() => {
    const seen = new Set();
    return (contributors || []).filter((c) => {
      const key = (c.email || c.name || String(c.id || c._id || '')).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [contributors]);

  return (
    <DataTable
      columns={COLUMNS}
      rows={uniqueRows}
      emptyIcon="fa-users"
      emptyTitle="No contributors yet"
      emptyMessage="Contributors who list items will appear here."
      renderRow={(c) => {
        const contribId = c._id || c.id;
        return [
          /* Contributor Name with Avatar */
          <td key="name" className="py-2.5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0">
                {(c.name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <Link
                  to={`/admin/contributors/${encodeURIComponent(contribId)}`}
                  className="font-bold text-slate-800 hover:text-brand-blue transition-colors group inline-flex items-center gap-1.5"
                  title={`View ${c.name}'s profile`}
                >
                  <span className="group-hover:underline truncate max-w-[150px]">{c.name}</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 group-hover:text-brand-blue transition-colors" />
                </Link>
              </div>
            </div>
          </td>,

          /* Contact: Phone & Email */
          <td key="contact" className="py-2.5 text-slate-600">
            <div className="flex flex-col gap-1 text-xs">
              {(c.phone || c.contact) && (
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <i className="fa-solid fa-phone text-[10px] text-slate-400 shrink-0" />
                  <span>{c.phone || c.contact}</span>
                </span>
              )}
              {c.email && (
                <span className="flex items-center gap-1.5 text-slate-500 truncate max-w-[200px]" title={c.email}>
                  <i className="fa-solid fa-envelope text-[10px] text-slate-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </span>
              )}
              {!c.phone && !c.contact && !c.email && <span className="text-slate-300">—</span>}
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

          /* Cancelled */
          <td key="cancelled" className="text-center py-2.5">
            <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-500 text-xs font-bold">
              {c.cancelledListings ?? c.cancelledCount ?? c.cancelled ?? 0}
            </span>
          </td>,
        ];
      }}
      className="border-0 shadow-none -m-5 rounded-none"
    />
  );
}