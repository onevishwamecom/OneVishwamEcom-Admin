import Skeleton from './Skeleton';
import SkeletonTableRow from './SkeletonTableRow';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * SkeletonTable — mirrors the app's ListingTable / DataTable layout so columns don't
 * collapse or shift while data is loading. Configurable rows/columns, optional
 * checkbox column, optional serial number column, optional action column, optional footer.
 */
export function SkeletonTable({
  rows = 8,
  columns = 5,
  checkbox = false,
  showIndex = false,
  action = false,
  headers = null,
  footer = false,
  className = '',
}) {
  const colCount = columns + (checkbox ? 1 : 0) + (showIndex ? 1 : 0) + (action ? 1 : 0);

  return (
    <SkeletonLoading label="Loading table data…">
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                {checkbox && (
                  <th className="px-3.5 py-2 w-10">
                    <Skeleton className="h-4 w-4" rounded="rounded" />
                  </th>
                )}
                {showIndex && (
                  <th className="px-3.5 py-2 w-12 text-center font-extrabold">
                    #
                  </th>
                )}
                {Array.from({ length: columns }).map((_, ci) => (
                  <th key={ci} className="px-3.5 py-2 font-extrabold text-slate-400">
                    {headers?.[ci] ? (
                      <span>{headers[ci]}</span>
                    ) : (
                      <Skeleton className="h-3 w-16" rounded="rounded" />
                    )}
                  </th>
                ))}
                {action && (
                  <th className="px-3.5 py-2 text-right">
                    <span className="sr-only">Actions</span>
                    <Skeleton className="h-3 w-12 ml-auto" rounded="rounded" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, ri) => (
                <SkeletonTableRow
                  key={ri}
                  columns={columns}
                  checkbox={checkbox}
                  showIndex={showIndex}
                  action={action}
                  even={ri % 2 === 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {footer && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <Skeleton className="h-3.5 w-40" rounded="rounded" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-7" rounded="rounded-md" />
              <Skeleton className="h-7 w-7" rounded="rounded-md" />
              <Skeleton className="h-7 w-7" rounded="rounded-md" />
            </div>
          </div>
        )}
        <span className="sr-only">{colCount} columns loading</span>
      </div>
    </SkeletonLoading>
  );
}

export default SkeletonTable;
