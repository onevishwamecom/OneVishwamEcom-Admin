import { useState } from 'react';
import Skeleton from './Skeleton';

/**
 * SkeletonImage — shows a skeleton while the image loads, then swaps in the
 * real image. On load error, renders the app's existing fallback placeholder
 * so no broken-image icon is shown.
 */
export function SkeletonImage({
  src,
  alt = '',
  className = '',
  rounded = 'rounded-xl',
  fallbackIcon = 'fa-image',
  imgClassName = '',
}) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} aria-hidden="true">
      {status !== 'loaded' && (
        <Skeleton className={`absolute inset-0 ${rounded} h-full w-full`} />
      )}

      {status !== 'error' && src && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
          <i className={`fa-solid ${fallbackIcon}`} />
        </div>
      )}
    </div>
  );
}

export default SkeletonImage;