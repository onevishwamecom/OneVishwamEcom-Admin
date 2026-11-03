import React from 'react';
import { OVERRIDE_INPUT_CLASS } from '../../ListingReview/constants';

export default function LocationListingFields({
  form,
  onChange,
  idPrefix = 'override',
}) {
  return (
    <div className="border-t border-slate-100 pt-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i className="fa-solid fa-location-dot text-emerald-600" />
        Location & Contact
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label htmlFor={`${idPrefix}-city`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id={`${idPrefix}-city`}
            type="text"
            value={form.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="e.g. bengaluru"
          />
        </div>

        {/* Area */}
        <div>
          <label htmlFor={`${idPrefix}-area`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Area / Locality
          </label>
          <input
            id={`${idPrefix}-area`}
            type="text"
            value={form.area || ''}
            onChange={(e) => onChange('area', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="e.g. Indiranagar, Whitefield"
          />
        </div>

        {/* Pincode */}
        <div>
          <label htmlFor={`${idPrefix}-pincode`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Pincode
          </label>
          <input
            id={`${idPrefix}-pincode`}
            type="text"
            value={form.pincode || ''}
            onChange={(e) => onChange('pincode', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="e.g. 560001"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor={`${idPrefix}-contact`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Contact Phone
          </label>
          <input
            id={`${idPrefix}-contact`}
            type="text"
            value={form.contact || ''}
            onChange={(e) => onChange('contact', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="e.g. 9876543210"
          />
        </div>

        {/* Full Address */}
        <div>
          <label htmlFor={`${idPrefix}-location`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Full Address / Landmark
          </label>
          <input
            id={`${idPrefix}-location`}
            type="text"
            value={form.location || form.address || ''}
            onChange={(e) => onChange('location', e.target.value)}
            className={OVERRIDE_INPUT_CLASS}
            placeholder="e.g. Near Metro Station"
          />
        </div>
      </div>
    </div>
  );
}
