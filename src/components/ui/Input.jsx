export function Input({
  label,
  id,
  type = 'text',
  icon,
  error,
  placeholder,
  value,
  onChange,
  required = false,
  variant = 'light',
  className = '',
  inputClassName = '',
  children,
  ...props
}) {
  const hasIcon = Boolean(icon);
  const dark = variant === 'dark';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-semibold ${
            dark ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {label} {required && <span className={dark ? 'text-red-400' : 'text-red-500'}>*</span>}
        </label>
      )}

      <div className="relative">
        {hasIcon && (
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
            dark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {typeof icon === 'string' ? <i className={`fa-solid ${icon}`} /> : icon}
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-2xl border text-sm outline-none transition-all duration-200 ${
            hasIcon ? 'pl-11' : 'px-4'
          } ${children ? 'pr-11' : 'pr-4'} py-3.5 ${
            dark
              ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 hover:border-white/20 focus:bg-white/[0.08] focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10'
              : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10'
          } ${
            error
              ? dark
                ? 'border-red-400/70 focus:border-red-400 focus:ring-red-400/10'
                : 'border-red-300 focus:border-red-500 focus:ring-red-500/10 focus:bg-white'
              : ''
          } ${inputClassName}`}
          {...props}
        />

        {children && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {children}
          </div>
        )}
      </div>

      {error && (
        <p className={`text-xs font-semibold animate-fade-in ${
          dark ? 'text-red-400' : 'text-red-500'
        }`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;