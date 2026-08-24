import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonButton from './SkeletonButton';

/** Card-shaped skeleton — header (icon/avatar + title) + body lines + optional footer button. */
export function SkeletonCard({
  header = true,
  avatar,
  lines = 3,
  footer,
  button,
  className = '',
  padded = true,
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-card ${className}`}>
      {header && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          {avatar && <SkeletonAvatar size={avatar} />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" rounded="rounded-md" />
            <Skeleton className="h-3 w-1/3" rounded="rounded-md" />
          </div>
        </div>
      )}
      <div className={padded ? 'p-5' : ''}>
        <SkeletonText lines={lines} className="space-y-0" />
        {footer && (
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-20" rounded="rounded-md" />
            {button && <SkeletonButton className="h-8 w-20" />}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkeletonCard;