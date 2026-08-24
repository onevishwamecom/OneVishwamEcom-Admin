export function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Select an option',
  className = '',
  selectClassName = '',
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full appearance-none rounded-2xl border bg-slate-50/50 px-4 py-3.5 pr-10 text-sm outline-none transition-all duration-200 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white'
              : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300'
          } ${selectClassName}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
          <i className="fa-solid fa-chevron-down text-xs" />
        </div>
      </div>
      
      {error && <p className="text-xs font-semibold text-red-500 animate-fade-in">{error}</p>}
    </div>
  );
}

export default Select;
