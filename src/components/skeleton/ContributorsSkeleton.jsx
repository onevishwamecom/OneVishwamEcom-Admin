import Skeleton from './Skeleton';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonTable from './SkeletonTable';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * ContributorsSkeleton — contributor cards grid + "All Contributors" table,
 * matching the Admin Contributors page layout.
 */
export function ContributorsSkeleton({ className = '' }) {
  return (
    <SkeletonLoading label="Loading contributors…" className={`space-y-6 ${className}`}>
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-48" rounded="rounded-lg" />
        <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-center gap-4 mb-4">
              <SkeletonAvatar size="h-12 w-12" />
              <Skeleton className="h-4 w-24" rounded="rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-2/3" rounded="rounded" />
              <Skeleton className="h-3 w-1/2" rounded="rounded" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="rounded-xl bg-slate-50 p-2 space-y-1.5">
                  <Skeleton className="h-3.5 w-8 mx-auto" rounded="rounded" />
                  <Skeleton className="h-2.5 w-12 mx-auto" rounded="rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="h-5 w-36 mb-4" rounded="rounded-md" />
        <SkeletonTable rows={8} columns={7} />
      </div>
    </SkeletonLoading>
  );
}

export default ContributorsSkeleton;