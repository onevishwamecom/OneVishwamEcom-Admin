const VARIANTS = {
  active: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
  success: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
  pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
  warning: 'bg-brand-orange/10 text-brand-orange border-brand-orange/25',
  inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  danger: 'bg-rose-50 text-rose-600 border-rose-200/60',
  blue: 'bg-blue-50 text-brand-blue border-blue-200/60',
  gold: 'bg-amber-50 text-brand-gold border-amber-200/60',
  orange: 'bg-orange-50 text-brand-orange border-orange-200/60',
};

export function Badge({ children, variant = 'active', className = '', icon, ...props }) {
  const badgeStyle = VARIANTS[variant] || VARIANTS.inactive;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize shadow-sm transition-all ${badgeStyle} ${className}`}
      {...props}
    >
      {icon && <i className={`fa-solid ${icon} text-[10px]`} />}
      {children}
    </span>
  );
}

export default Badge;
