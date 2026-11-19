import Skeleton from './Skeleton';
import SkeletonTable from './SkeletonTable';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * DashboardSkeleton — mirrors Admin Dashboard layout:
 * 1. Executive Welcome Banner (h-40 with gradient & buttons skeleton)
 * 2. 4 Stat Cards with top-row labels & icons
 * 3. 2-Column Analytics Grid (Traffic & Users)
 * 4. SectionCard with Team Members table
 */
export function DashboardSkeleton({ className = '' }) {
  return (
    <SkeletonLoading label="Loading dashboard…" className={`space-y-6 ${className}`}>
      {/* ── Welcome Banner Skeleton ── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 p-5 sm:p-6 border border-slate-200 overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" rounded="rounded" />
              <Skeleton className="h-6 w-48" rounded="rounded-lg" />
              <Skeleton className="h-3 w-64 max-w-full" rounded="rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0">
            <Skeleton className="h-9 w-36 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* ── 4 Stat Cards Skeleton ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-24" rounded="rounded" />
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            </div>
            <Skeleton className="h-8 w-20" rounded="rounded-lg" />
          </div>
        ))}
      </div>

      {/* ── 2-Column Analytics Grid Skeleton ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-6">
        {/* Card 1 Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-44" rounded="rounded-md" />
                <Skeleton className="h-3 w-32" rounded="rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>

        {/* Card 2 Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-44" rounded="rounded-md" />
                <Skeleton className="h-3 w-32" rounded="rounded" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      </div>

      {/* ── Team Members Table Skeleton ── */}
      <div>
        <Skeleton className="h-5 w-40 mb-4" rounded="rounded-md" />
        <SkeletonTable rows={6} columns={6} />
      </div>
    </SkeletonLoading>
  );
}

export default DashboardSkeleton;
