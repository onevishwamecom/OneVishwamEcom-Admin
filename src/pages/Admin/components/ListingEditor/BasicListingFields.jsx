import React from 'react';
import { OVERRIDE_INPUT_CLASS } from '../../ListingReview/constants';

export default function BasicListingFields({
  form,
  onChange,
  subcategoryList = [],
  idPrefix = 'override',
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i className="fa-solid fa-file-lines text-brand-blue" />
        Basic Information
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-title`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Title / Item Name <span className="text-red-500">*</span>
          </label>
          <input
            id={`${idPrefix}-title`}
            type="text"
            value={form.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="Listing title"
          />
        </div>

        {/* Subcategory */}
        <div>
          <label htmlFor={`${idPrefix}-subcategory`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Subcategory
          </label>
          <select
            id={`${idPrefix}-subcategory`}
            value={form.subcategory || ''}
            onChange={(e) => onChange('subcategory', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
          >
            <option value="">Select Subcategory</option>
            {subcategoryList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Subtitle */}
        <div>
          <label htmlFor={`${idPrefix}-subtitle`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Subtitle / Tagline
          </label>
          <input
            id={`${idPrefix}-subtitle`}
            type="text"
            value={form.subtitle || ''}
            onChange={(e) => onChange('subtitle', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="Short tagline"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-description`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Description
          </label>
          <textarea
            id={`${idPrefix}-description`}
            rows={3}
            value={form.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            className={`${OVERRIDE_INPUT_CLASS} resize-none`}
            placeholder="Full details of the listing"
          />
        </div>
      </div>
    </div>
  );
}
