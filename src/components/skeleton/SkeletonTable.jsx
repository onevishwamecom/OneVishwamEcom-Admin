import Skeleton from './Skeleton';
import SkeletonTableRow from './SkeletonTableRow';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * SkeletonTable — mirrors the app's DataTable layout so columns don't
 * collapse while data is loading. Configurable rows/columns, optional
 * checkbox column, optional action column, optional footer.
 */
export function SkeletonTable({
  rows = 8,
  columns = 5,
  checkbox = false,
  action = false,
  headers = null,
  footer = false,
  className = '',
}) {
  const colCount = columns + (checkbox ? 1 : 0) + (action ? 1 : 0) + 1;

  return (
    <SkeletonLoading label="Loading table data…">
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-400 border-b-2 border-slate-100">
                {checkbox && (
                  <th className="px-4 py-3.5 w-10 bg-slate-50">
                    <Skeleton className="h-4 w-4" rounded="rounded" />
                  </th>
                )}
                <th className="px-4 py-3.5 font-medium w-12 bg-slate-50 text-center">
                  <Skeleton className="h-3 w-4 mx-auto" rounded="rounded" />
                </th>
                {Array.from({ length: columns }).map((_, ci) => (
                  <th key={ci} className="px-5 py-3.5 font-medium bg-slate-50">
                    {headers?.[ci] || <Skeleton className="h-3 w-16" rounded="rounded" />}
                  </th>
                ))}
                {action && (
                  <th className="px-5 py-3.5 font-medium bg-slate-50 text-right">
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
                  action={action}
                  even={ri % 2 === 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {footer && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100/80">
            <Skeleton className="h-3.5 w-48" rounded="rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" rounded="rounded-md" />
              <Skeleton className="h-8 w-8" rounded="rounded-md" />
              <Skeleton className="h-8 w-8" rounded="rounded-md" />
            </div>
          </div>
        )}
        <span className="sr-only">{colCount} columns loading</span>
      </div>
    </SkeletonLoading>
  );
}

export default SkeletonTable;