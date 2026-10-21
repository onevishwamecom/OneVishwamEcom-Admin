import React from 'react';
import { OVERRIDE_INPUT_CLASS } from '../../ListingReview/constants';

export default function DynamicCategoryFields({
  catFields = [],
  form = {},
  listing = {},
  onChange,
  categoryLabel = 'Properties',
  idPrefix = 'override',
}) {
  if (!catFields || catFields.length === 0) return null;

  return (
    <div className="border-t border-slate-100 pt-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i className="fa-solid fa-sliders text-brand-orange" />
        Category Specifications ({categoryLabel})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catFields.map((f) => {
          const curVal = form[f.key] ?? listing?.details?.[f.key] ?? listing?.[f.key] ?? '';

          return (
            <div key={f.key}>
              <label htmlFor={`${idPrefix}-${f.key}`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {f.label}
              </label>

              {f.key === 'possessionStatus' && (
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const val = f.options?.includes('Ready for Registration')
                        ? 'Ready for Registration'
                        : 'Ready to Occupy';
                      onChange(f.key, val);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      (form[f.key] === 'Ready for Registration' || form[f.key] === 'Ready to Occupy')
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <i className="fa-solid fa-circle-check text-emerald-500 mr-1.5" />
                    {f.options?.includes('Ready for Registration') ? 'Ready for Reg.' : 'Ready to Occupy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(f.key, 'Under Construction')}
                    className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      form[f.key] === 'Under Construction'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <i className="fa-solid fa-person-digging text-amber-500 mr-1.5" />
                    Under Construction
                  </button>
                </div>
              )}

              {f.type === 'select' ? (
                <select
                  id={`${idPrefix}-${f.key}`}
                  value={curVal}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={OVERRIDE_INPUT_CLASS}
                >
                  <option value="">Select {f.label}</option>
                  {f.options?.map((opt) => {
                    const optVal = typeof opt === 'object' ? opt.value : opt;
                    const optLabel = typeof opt === 'object' ? opt.label : opt;
                    return (
                      <option key={optVal} value={optVal}>
                        {optLabel}
                      </option>
                    );
                  })}
                  {curVal && !f.options?.some(opt => (typeof opt === 'object' ? opt.value : opt) === curVal) && (
                    <option value={curVal}>{curVal}</option>
                  )}
                </select>
              ) : (
                <input
                  id={`${idPrefix}-${f.key}`}
                  type={f.type || 'text'}
                  value={curVal}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className={OVERRIDE_INPUT_CLASS}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
