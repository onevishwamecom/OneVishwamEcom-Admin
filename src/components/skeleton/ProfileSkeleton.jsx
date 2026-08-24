import Skeleton from './Skeleton';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonText from './SkeletonText';
import SkeletonButton from './SkeletonButton';
import SkeletonTable from './SkeletonTable';
import { SkeletonLoading } from './SkeletonLoading';

/** ProfileSkeleton — contributor/profile header, stat boxes and items table. */
export function ProfileSkeleton({ className = '' }) {
  return (
    <SkeletonLoading label="Loading profile…" className={`space-y-6 ${className}`}>
      <Skeleton className="h-4 w-40" rounded="rounded-md" />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <SkeletonAvatar size="h-20 w-20" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" rounded="rounded-lg" />
            <div className="flex flex-wrap gap-6">
              <Skeleton className="h-4 w-28" rounded="rounded" />
              <Skeleton className="h-4 w-40" rounded="rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <Skeleton className="h-3 w-20 mb-3" rounded="rounded" />
            <Skeleton className="h-7 w-14 mb-2" rounded="rounded-lg" />
            <Skeleton className="h-3 w-24" rounded="rounded" />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" rounded="rounded-md" />
          <Skeleton className="h-5 w-24" rounded="rounded-md" />
        </div>
        <SkeletonTable rows={6} columns={4} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <SkeletonText lines={3} />
        <div className="flex gap-3 mt-5">
          <SkeletonButton className="h-10 w-28" />
          <SkeletonButton className="h-10 w-28" />
        </div>
      </div>
    </SkeletonLoading>
  );
}

export default ProfileSkeleton;