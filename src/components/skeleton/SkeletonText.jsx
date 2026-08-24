import Skeleton from './Skeleton';

/** Text line skeleton (defaults to a small paragraph line). */
export function SkeletonText({ width = '100%', height = 'h-4', lines = 1, className = '', lineClassName = '', ...rest }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={lines > 1 && i === lines - 1 ? '60%' : width}
          rounded="rounded-md"
          className={`mb-2 last:mb-0 ${lineClassName}`}
          {...rest}
        />
      ))}
    </div>
  );
}

/** Single-line text shorthand. */
export function SkeletonTextLine({ className = '', ...rest }) {
  return <SkeletonText className={className} {...rest} />;
}

export default SkeletonText;