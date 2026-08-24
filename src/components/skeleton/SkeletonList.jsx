import Skeleton from './Skeleton';
import SkeletonAvatar from './SkeletonAvatar';
import { SkeletonLoading } from './SkeletonLoading';

/** Generic list of rows — avatar + title + subtitle lines. */
export function SkeletonList({ rows = 6, className = '', avatar = true }) {
  return (
    <SkeletonLoading label="Loading list…">
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-card divide-y divide-slate-100 overflow-hidden ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            {avatar && <SkeletonAvatar size="h-10 w-10" />}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/2" rounded="rounded" />
              <Skeleton className="h-3 w-2/3" rounded="rounded" />
            </div>
            <Skeleton className="h-6 w-16 shrink-0" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </SkeletonLoading>
  );
}

export default SkeletonList;