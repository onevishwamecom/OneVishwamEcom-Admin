/**
 * SkeletonLoading — wrapper that provides accessible loading semantics.
 * Renders `role="status"` + `aria-busy` on the container and screen-reader
 * text so shimmer is not the only loading indication.
 */
export function SkeletonLoading({
  children,
  label = 'Loading content…',
  className = '',
  busy = true,
}) {
  return (
    <div
      role="status"
      aria-busy={busy}
      className={className}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}