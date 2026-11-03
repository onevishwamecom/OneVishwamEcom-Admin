import React from 'react';
import { OVERRIDE_INPUT_CLASS, PRICE_UNITS, PRICE_SUFFIXES_BY_CATEGORY } from '../../ListingReview/constants';

export default function PricingListingFields({
  form,
  onChange,
  typeKey = 'properties',
  idPrefix = 'override',
}) {
  const suffixes = PRICE_SUFFIXES_BY_CATEGORY[typeKey] || ['', '/ month', '/ year', 'Onwards'];

  return (
    <div className="border-t border-slate-100 pt-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i className="fa-solid fa-tag text-brand-gold" />
        Pricing & Commercials
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Price */}
        <div>
          <label htmlFor={`${idPrefix}-price`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400 font-bold text-sm">₹</span>
            </div>
            <input
              id={`${idPrefix}-price`}
              type="text"
              value={form.price ?? ''}
              onChange={(e) => onChange('price', e.target.value)}
              className={`${OVERRIDE_INPUT_CLASS} pl-8`}
              placeholder="e.g. 4.5"
            />
          </div>
        </div>

        {/* Unit */}
        <div>
          <label htmlFor={`${idPrefix}-priceUnit`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Unit
          </label>
          <select
            id={`${idPrefix}-priceUnit`}
            value={form.priceUnit || 'exact'}
            onChange={(e) => onChange('priceUnit', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
          >
            {PRICE_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        {/* Price Type */}
        <div>
          <label htmlFor={`${idPrefix}-priceType`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Price Type
          </label>
          <select
            id={`${idPrefix}-priceType`}
            value={form.priceType || 'fixed'}
            onChange={(e) => onChange('priceType', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
          >
            <option value="fixed">Fixed Price</option>
            <option value="negotiable">Negotiable</option>
            <option value="per-month">Per Month (Rent/Lease)</option>
            <option value="per-year">Per Year</option>
            <option value="on-request">Price on Request</option>
          </select>
        </div>

        {/* Price Suffix */}
        <div>
          <label htmlFor={`${idPrefix}-priceSuffix`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Price Suffix
          </label>
          <select
            id={`${idPrefix}-priceSuffix`}
            value={form.priceSuffix || ''}
            onChange={(e) => onChange('priceSuffix', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
          >
            {suffixes.map((s) => (
              <option key={s} value={s}>{s || '(None)'}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
