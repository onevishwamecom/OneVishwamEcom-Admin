import React from 'react';
import { formatDate } from '../../../../utils';
import { Skeleton } from '../../../../components/skeleton';

export default function TemplateDownloadLogsTab({
  logsData = { logs: [], total: 0, page: 1, pages: 1 },
  loadingLogs = false,
  logSearch = '',
  setLogSearch,
  logCategoryFilter = 'all',
  setLogCategoryFilter,
  logPage = 1,
  setLogPage,
  onSearchSubmit,
  onRefresh,
}) {
  return (
    <div className="space-y-4">
      {/* Search & Category Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={onSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass text-slate-400 absolute left-3 top-2.5 text-xs" />
            <input
              type="search"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search by lister name, email, or filename..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <select
            value={logCategoryFilter}
            onChange={(e) => {
              setLogCategoryFilter(e.target.value);
              setLogPage(1);
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-blue text-slate-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="properties">Properties</option>
            <option value="vehicle">Vehicles</option>
            <option value="grocery">Groceries</option>
            <option value="garment">Garments</option>
            <option value="jewellery">Jewellery</option>
          </select>

          <button
            type="button"
            onClick={onRefresh}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-rotate text-xs" /> Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loadingLogs ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : logsData.logs?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-clock-rotate-left text-xl" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No Template Download Logs</h3>
            <p className="text-xs text-slate-500">
              No listers have downloaded bulk listing templates yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                  <th className="px-4 py-3">Lister</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Downloaded Filename</th>
                  <th className="px-4 py-3">Downloaded At</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Device / User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logsData.logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{log.listerName || 'Unknown Lister'}</p>
                      <p className="text-[11px] text-slate-500">{log.listerEmail || 'No email'}</p>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {log.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-slate-800">
                      <i className="fa-solid fa-file-excel text-emerald-600 mr-1.5" />
                      {log.filename}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {formatDate(log.downloadedAt || log.createdAt)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {log.ip || '—'}
                    </td>

                    <td className="px-4 py-3 max-w-[220px] truncate text-[11px] text-slate-500" title={log.userAgent}>
                      {log.userAgent || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {logsData.pages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {logsData.page} of {logsData.pages} ({logsData.total} logs)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                disabled={logPage <= 1}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setLogPage((p) => Math.min(logsData.pages, p + 1))}
                disabled={logPage >= logsData.pages}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
