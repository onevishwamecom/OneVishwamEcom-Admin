import Skeleton from './Skeleton';

/** Circular skeleton. */
export function SkeletonCircle({ size = 'h-10 w-10', className = '', ...rest }) {
  return <Skeleton className={`rounded-full ${size} ${className}`} {...rest} />;
}

/** Square/tile skeleton block. */
export function SkeletonBlock({ className = '', ...rest }) {
  return <Skeleton className={className} {...rest} />;
}

export default SkeletonCircle;