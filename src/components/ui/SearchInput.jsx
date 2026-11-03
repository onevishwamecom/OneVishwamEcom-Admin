import React from 'react';

/**
 * Reusable SearchInput with leading magnifying glass and instant clear button.
 */
export function SearchInput({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  wrapperClassName = '',
  icon = 'fa-magnifying-glass',
  ...props
}) {
  const handleChange = (e) => {
    onChange && onChange(e.target.value, e);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      <i
        className={`fa-solid ${icon} absolute left-3 text-slate-400 text-xs pointer-events-none`}
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${className}`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[9px] transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
