import Skeleton from './Skeleton';
import SkeletonTable from './SkeletonTable';
import { SkeletonLoading } from './SkeletonLoading';

/** CategoriesSkeleton — sector breakdown table, matching the Admin Categories page. */
export function CategoriesSkeleton({ className = '' }) {
  return (
    <SkeletonLoading label="Loading categories…" className={`space-y-6 ${className}`}>
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-48" rounded="rounded-lg" />
        <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />
      </div>

      <div>
        <Skeleton className="h-5 w-40 mb-4" rounded="rounded-md" />
        <SkeletonTable rows={7} columns={6} />
      </div>
    </SkeletonLoading>
  );
}

export default CategoriesSkeleton;