import Skeleton from './Skeleton';
import SkeletonButton from './SkeletonButton';
import SkeletonImage from './SkeletonImage';

/**
 * ListingCardSkeleton — mirrors the app's listing card layout
 * (image, title, subtitle, price, location, action). Used wherever listing
 * cards load from an API.
 */
export function ListingCardSkeleton({ horizontal = false, className = '' }) {
  if (horizontal) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card ${className}`}>
        <div className="flex">
          <SkeletonImage className="w-32 h-32 rounded-none" fallbackIcon="fa-image" />
          <div className="flex-1 p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
            <Skeleton className="h-3 w-full" rounded="rounded" />
            <Skeleton className="h-3 w-1/2" rounded="rounded" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-3.5 w-20" rounded="rounded" />
              <SkeletonButton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card ${className}`}>
      {/* Image */}
      <Skeleton className="h-40 w-full rounded-none" />

      {/* Body */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
        <Skeleton className="h-3 w-full" rounded="rounded" />
        <Skeleton className="h-3 w-2/3" rounded="rounded" />

        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-20" rounded="rounded" />
          <Skeleton className="h-4 w-14" rounded="rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" rounded="rounded" />
          <Skeleton className="h-3 w-16" rounded="rounded" />
        </div>
      </div>
    </div>
  );
}
export default ListingCardSkeleton;