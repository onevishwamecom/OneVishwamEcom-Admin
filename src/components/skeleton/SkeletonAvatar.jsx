import SkeletonCircle from './SkeletonCircle';

/** Avatar-shaped skeleton (gradient circle like the app's contributor avatars). */
export function SkeletonAvatar({ size = 'h-12 w-12', className = '', ...rest }) {
  return <SkeletonCircle size={size} className={className} {...rest} />;
}

export default SkeletonAvatar;