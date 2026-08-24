import ListingCardSkeleton from './ListingCardSkeleton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * ListingGridSkeleton — responsive grid of listing card skeletons.
 * Desktop: 4 · Tablet: 2 · Mobile: 1 (matches the app's card grid breakpoints).
 */
export function ListingGridSkeleton({ count = 6, horizontal = false, className = '' }) {
  return (
    <SkeletonLoading label="Loading listings…" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <ListingCardSkeleton key={i} horizontal={horizontal} />
        ))}
      </div>
    </SkeletonLoading>
  );
}

export default ListingGridSkeleton;