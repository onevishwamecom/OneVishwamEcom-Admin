import React from 'react';

/**
 * SkeletonMask — Auto-adapting layout skeleton wrapper.
 * When `loading` is true, masks children with an animated shimmer overlay
 * that automatically mirrors the exact DOM layout, padding, grid, and widths
 * of the wrapped component without needing dedicated skeleton templates.
 */
export function SkeletonMask({
  loading = true,
  children,
  className = '',
  ...props
}) {
  if (!loading) return children;

  return (
    <div
      className={`skeleton-mask ${className}`}
      data-skeleton="true"
      aria-busy="true"
      role="status"
      {...props}
    >
      <span className="sr-only">Loading content…</span>
      {children}
    </div>
  );
}

export default SkeletonMask;
