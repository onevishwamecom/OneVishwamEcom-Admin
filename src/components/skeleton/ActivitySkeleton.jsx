import Skeleton from './Skeleton';
import SkeletonTable from './SkeletonTable';
import { SkeletonLoading } from './SkeletonLoading';

/** ActivitySkeleton — audit-trail table, matching the Admin Activity page. */
export function ActivitySkeleton({ className = '' }) {
  return (
    <SkeletonLoading label="Loading activity…" className={`space-y-6 ${className}`}>
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-40" rounded="rounded-lg" />
        <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />
      </div>

      <SkeletonTable rows={8} columns={5} />
    </SkeletonLoading>
  );
}

export default ActivitySkeleton;