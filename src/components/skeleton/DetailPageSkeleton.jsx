import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonButton from './SkeletonButton';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonImage from './SkeletonImage';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * DetailPageSkeleton — reusable skeleton for product/property/service detail
 * pages: gallery, title, location, price, metadata grid, description,
 * action buttons, seller/contributor card and related-items row.
 */
export function DetailPageSkeleton({
  gallery = true,
  galleryHeight = 'h-64 sm:h-80',
  metadata = 4,
  description = 5,
  related = 3,
  className = '',
}) {
  return (
    <SkeletonLoading label="Loading details…" className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" rounded="rounded-xl" />
        <Skeleton className="h-7 w-56" rounded="rounded-lg" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="xl:col-span-2 space-y-6">
          {gallery && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
              <Skeleton className={`w-full ${galleryHeight}`} rounded="rounded-xl" />
              <div className="grid grid-cols-4 gap-3 mt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonImage key={i} className="h-16" fallbackIcon="fa-image" />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="space-y-2.5">
              <Skeleton className="h-6 w-3/4" rounded="rounded-lg" />
              <Skeleton className="h-4 w-1/2" rounded="rounded-md" />
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-7 w-28" rounded="rounded-lg" />
                <Skeleton className="h-4 w-20" rounded="rounded" />
              </div>
            </div>

            {metadata > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {Array.from({ length: metadata }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-slate-50 p-3 space-y-2">
                    <Skeleton className="h-3 w-14" rounded="rounded" />
                    <Skeleton className="h-4 w-20" rounded="rounded" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Skeleton className="h-4 w-24 mb-3" rounded="rounded-md" />
              <SkeletonText lines={description} />
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <SkeletonButton className="h-11 w-32" />
              <SkeletonButton className="h-11 w-32" />
            </div>
          </div>
        </div>

        {/* Seller / contributor column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-center gap-4">
              <SkeletonAvatar size="h-14 w-14" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" rounded="rounded-md" />
                <Skeleton className="h-3 w-20" rounded="rounded" />
              </div>
            </div>
            <div className="space-y-2.5 mt-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-full" rounded="rounded" />
              ))}
            </div>
            <SkeletonButton className="h-10 w-full mt-5" />
          </div>
        </div>
      </div>

      {/* Related / similar items */}
      {related > 0 && (
        <div>
          <Skeleton className="h-5 w-44 mb-4" rounded="rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: related }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card">
                <Skeleton className="h-36 w-full rounded-none" />
                <div className="p-4 space-y-2.5">
                  <Skeleton className="h-3.5 w-3/4" rounded="rounded" />
                  <Skeleton className="h-3 w-1/2" rounded="rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SkeletonLoading>
  );
}

export default DetailPageSkeleton;