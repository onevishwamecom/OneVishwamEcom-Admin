import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * DetailPageSkeleton — reusable skeleton for product/property/service detail pages:
 * PageHeader (title, subtitle, back button), main content (gallery, info cards),
 * and right column status & action card.
 */
export function DetailPageSkeleton({
  gallery = true,
  galleryHeight = 'h-64 sm:h-80',
  className = '',
}) {
  return (
    <SkeletonLoading label="Loading details…" className={`space-y-5 ${className}`}>
      {/* Header matching PageHeader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 max-w-full" rounded="rounded-lg" />
          <Skeleton className="h-4 w-40" rounded="rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-2xl" />
      </div>

      {/* Main Grid: 2 cols main, 1 col sidebar */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {gallery && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <Skeleton className={`w-full ${galleryHeight}`} rounded="rounded-xl" />
              <div className="grid grid-cols-4 gap-3 mt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" rounded="rounded-lg" />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <Skeleton className="h-5 w-36" rounded="rounded-md" />
            <SkeletonText lines={4} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3 space-y-2">
                  <Skeleton className="h-3 w-14" rounded="rounded" />
                  <Skeleton className="h-4 w-20" rounded="rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Status Card */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" rounded="rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3.5 w-full" rounded="rounded" />
              <Skeleton className="h-3.5 w-2/3" rounded="rounded" />
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonLoading>
  );
}

export default DetailPageSkeleton;
