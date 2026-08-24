/**
 * Base skeleton block. Uses the app's existing `shimmer` animation (or an
 * accessible soft `skeleton-pulse` variant). Supports both utility-class
 * sizing (h-4 w-32) and numeric width/height props.
 */
export default function Skeleton({
  width,
  height,
  className = '',
  rounded = 'rounded-xl',
  variant = 'shimmer', // 'shimmer' | 'pulse'
  style,
  ...rest
}) {
  const sizeStyle = {};
  if (typeof width === 'number') sizeStyle.width = width;
  if (typeof height === 'number') sizeStyle.height = height;

  return (
    <div
      className={`${variant === 'pulse' ? 'skeleton-pulse' : 'shimmer'} ${rounded} ${className}`}
      style={{ ...sizeStyle, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}