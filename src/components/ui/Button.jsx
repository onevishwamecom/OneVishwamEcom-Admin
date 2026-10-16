import React from 'react';
import { Link } from 'react-router-dom';

const VARIANTS = {
  primary:
    'bg-brand-blue text-white hover:bg-blue-700 active:bg-blue-800 border border-transparent shadow-xs focus:ring-brand-blue/30',
  gold:
    'bg-brand-gold text-brand-navy hover:bg-amber-400 active:bg-amber-500 border border-transparent shadow-xs focus:ring-brand-gold/30',
  emerald:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 border border-transparent shadow-xs focus:ring-emerald-500/30',
  'emerald-outline':
    'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-300 shadow-xs focus:ring-emerald-400/30',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 shadow-2xs focus:ring-slate-300/30',
  outline:
    'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-2xs focus:ring-slate-200/50',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-transparent shadow-xs focus:ring-rose-500/30',
  'danger-soft':
    'bg-rose-50 text-rose-600 hover:bg-rose-100 active:bg-rose-200 border border-rose-200/80 shadow-2xs focus:ring-rose-300/30',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent focus:ring-slate-200/30',
  blue:
    'bg-blue-50 text-brand-blue hover:bg-blue-100 active:bg-blue-200 border border-blue-200/80 shadow-2xs focus:ring-blue-300/30',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs font-bold rounded-lg gap-1.5',
  md: 'px-4 py-2 text-xs font-bold rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2.5',
  'icon-xs': 'w-6 h-6 p-0 rounded-md text-[10px]',
  'icon-sm': 'w-7 h-7 p-0 rounded-lg text-xs',
  icon: 'w-8 h-8 p-0 rounded-lg text-xs',
  'icon-md': 'w-9 h-9 p-0 rounded-xl text-sm',
  'icon-lg': 'w-10 h-10 p-0 rounded-xl text-base',
};

/**
 * Universal Button component with extensive variants, sizes, and router Link support.
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  to,
  href,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const isIconOnly = size.startsWith('icon');
  const baseClasses =
    'inline-flex items-center justify-center transition-all duration-150 select-none outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-45 disabled:pointer-events-none active:scale-[0.98]';
  const variantClasses = VARIANTS[variant] || VARIANTS.secondary;
  const sizeClasses = SIZES[size] || SIZES.sm;
  const widthClasses = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`;

  const iconElement = loading ? (
    <i className="fa-solid fa-spinner fa-spin text-current" aria-hidden="true" />
  ) : icon ? (
    <i
      className={`fa-solid ${icon} text-current ${!isIconOnly && children ? 'shrink-0' : ''}`}
      aria-hidden="true"
    />
  ) : null;

  const content = (
    <>
      {iconElement && iconPosition === 'left' && iconElement}
      {children && <span>{children}</span>}
      {iconElement && iconPosition === 'right' && !loading && iconElement}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
