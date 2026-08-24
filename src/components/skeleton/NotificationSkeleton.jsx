import Skeleton from './Skeleton';
import { SkeletonLoading } from './SkeletonLoading';

/** NotificationSkeleton — list of notification rows with icon, title, meta. */
export function NotificationSkeleton({ rows = 6, className = '' }) {
  return (
    <SkeletonLoading label="Loading notifications…">
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-card divide-y divide-slate-100 overflow-hidden ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4">
            <Skeleton className="h-9 w-9 shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-3/4" rounded="rounded" />
              <Skeleton className="h-3 w-1/2" rounded="rounded" />
            </div>
            <Skeleton className="h-3 w-12 shrink-0 mt-1" rounded="rounded" />
          </div>
        ))}
      </div>
    </SkeletonLoading>
  );
}

export default NotificationSkeleton;