import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCard from './SkeletonCard';
import SkeletonButton from './SkeletonButton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * Generic page skeleton — header title/subtitle, optional filter row, then a
 * configurable content section (cards grid / rows list / standalone block).
 */
export function PageSkeleton({
  title = true,
  subtitle = true,
  actions = false,
  grid = false,
  cardCount = 4,
  rows = 0,
  block = false,
  className = '',
  columns = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
}) {
  return (
    <SkeletonLoading label="Loading page…" className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          {title && <Skeleton className="h-7 w-48 sm:w-56" rounded="rounded-lg" />}
          {subtitle && <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />}
        </div>
        {actions && (
          <div className="flex gap-2">
            <SkeletonButton className="h-9 w-24" />
            <SkeletonButton className="h-9 w-24" />
          </div>
        )}
      </div>

      {/* Cards */}
      {grid && (
        <div className={`grid ${columns} gap-4`}>
          {Array.from({ length: cardCount }).map((_, i) => (
            <SkeletonCard key={i} header={false} lines={3} />
          ))}
        </div>
      )}

      {/* Rows list */}
      {rows > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card divide-y divide-slate-100 overflow-hidden">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-9 w-9 shrink-0" rounded="rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/3" rounded="rounded" />
                <Skeleton className="h-3 w-1/2" rounded="rounded" />
              </div>
              <Skeleton className="h-6 w-14 shrink-0" rounded="rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Standalone content block */}
      {block && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <SkeletonText lines={5} />
        </div>
      )}
    </SkeletonLoading>
  );
}

export default PageSkeleton;