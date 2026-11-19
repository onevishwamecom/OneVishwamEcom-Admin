import Skeleton from './Skeleton';
import SkeletonTable from './SkeletonTable';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * DashboardSkeleton — summary/stat cards + a contributors-style table,
 * matching the Admin Dashboard layout.
 */
export function DashboardSkeleton({ className = '' }) {
  return (
    <SkeletonLoading label="Loading dashboard…" className={`space-y-6 ${className}`}>
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-40" rounded="rounded-lg" />
        <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-8 w-16" rounded="rounded-lg" />
              <Skeleton className="h-3 w-24" rounded="rounded" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="h-5 w-40 mb-4" rounded="rounded-md" />
        <SkeletonTable rows={6} columns={6} />
      </div>
    </SkeletonLoading>
  );
}

export default DashboardSkeleton;