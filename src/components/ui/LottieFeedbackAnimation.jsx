import React from 'react';
import { Lottie } from 'lottie-react';

import comingSoonAnimation from '../../assets/lottie/comingSoonAnimation.json';
import emptyCatalogAnimation from '../../assets/lottie/emptyCatalogAnimation.json';
import notFound404Animation from '../../assets/lottie/notFound404Animation.json';
import searchEmptyAnimation from '../../assets/lottie/searchEmptyAnimation.json';
import successAnimation from '../../assets/lottie/successAnimation.json';

const ANIMATION_MAP = {
  comingSoon: comingSoonAnimation,
  emptyCatalog: emptyCatalogAnimation,
  notFound404: notFound404Animation,
  searchEmpty: searchEmptyAnimation,
  success: successAnimation,
};

const SIZE_CONFIG = {
  xs: { className: 'w-20 h-20', width: 80, height: 80 },
  sm: { className: 'w-28 h-28', width: 112, height: 112 },
  md: { className: 'w-44 h-44', width: 176, height: 176 },
  lg: { className: 'w-56 h-56', width: 224, height: 224 },
  xl: { className: 'w-72 h-72', width: 288, height: 288 },
};

const FALLBACK_ICON_MAP = {
  comingSoon: 'fa-solid fa-clock',
  emptyCatalog: 'fa-solid fa-inbox',
  notFound404: 'fa-solid fa-triangle-exclamation',
  searchEmpty: 'fa-solid fa-magnifying-glass',
  success: 'fa-solid fa-circle-check',
};

/**
 * Admin Lottie feedback animation component.
 *
 * @param {Object} props
 * @param {'comingSoon' | 'emptyCatalog' | 'notFound404' | 'searchEmpty' | 'success'} [props.type='emptyCatalog']
 * @param {Object} [props.animationData] - Custom animation override
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {boolean} [props.loop]
 * @param {boolean} [props.autoplay=true]
 * @param {string} [props.className='']
 * @param {string} [props.fallbackIcon]
 * @param {Object} [props.style]
 */
export default function LottieFeedbackAnimation({
  type = 'emptyCatalog',
  animationData: customAnimationData,
  size = 'md',
  loop,
  autoplay = true,
  className = '',
  fallbackIcon,
  style = {},
}) {
  const resolvedAnimationData = customAnimationData || ANIMATION_MAP[type] || ANIMATION_MAP.emptyCatalog;
  const isLoop = loop !== undefined ? loop : type !== 'success';
  const sizeCfg = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const defaultFallback = fallbackIcon || FALLBACK_ICON_MAP[type] || 'fa-solid fa-inbox';

  if (!resolvedAnimationData) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ${sizeCfg.className} ${className}`}
        style={{ width: `${sizeCfg.width}px`, height: `${sizeCfg.height}px`, ...style }}
      >
        <i className={`${defaultFallback} text-2xl animate-pulse`} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center mx-auto pointer-events-none select-none transition-transform duration-300 ${sizeCfg.className} ${className}`}
      style={{
        width: `${sizeCfg.width}px`,
        height: `${sizeCfg.height}px`,
        minWidth: `${sizeCfg.width}px`,
        minHeight: `${sizeCfg.height}px`,
        ...style,
      }}
      aria-hidden="true"
    >
      <Lottie
        src={resolvedAnimationData}
        loop={isLoop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
