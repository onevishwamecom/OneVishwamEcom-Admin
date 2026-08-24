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
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10" rounded="rounded-xl" />
              <Skeleton className="h-3 w-24" rounded="rounded" />
            </div>
            <Skeleton className="h-7 w-16 mb-2" rounded="rounded-lg" />
            <Skeleton className="h-3 w-20" rounded="rounded" />
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