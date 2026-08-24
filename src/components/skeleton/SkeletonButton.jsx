import Skeleton from './Skeleton';

/** Button-shaped skeleton. */
export function SkeletonButton({ className = '', ...rest }) {
  return <Skeleton className={`h-10 w-28 ${className}`} rounded="rounded-xl" {...rest} />;
}

/** Small pill/badge-shaped skeleton. */
export function SkeletonPill({ className = '', ...rest }) {
  return <Skeleton className={`h-5 w-16 ${className}`} rounded="rounded-full" {...rest} />;
}

export default SkeletonButton;