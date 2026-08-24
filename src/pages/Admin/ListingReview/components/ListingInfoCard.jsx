import { formatINR, formatDate } from '../../../../utils';
import { CATEGORY_SPECIFIC_FIELDS } from '../constants';
import Field from './Field';

export default function ListingInfoCard({ listing, images, category }) {
  const typeKey = category?.id || listing?._type || listing?.category || 'properties';
  const catFields = CATEGORY_SPECIFIC_FIELDS[typeKey] || category?.fields || [];

  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-6">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
        <i className="fa-solid fa-file-lines text-brand-blue" aria-hidden="true" />
        Listing Information
      </h3>

      {/* Subcategory and Category Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue/10 text-brand-blue">
          {category?.label || listing?.category || typeKey}
        </span>
        {(listing.subcategory || listing.subCategory) && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Subcategory: {listing.subcategory || listing.subCategory}
          </span>
        )}
        {listing.subtitle && (
          <span className="text-xs text-slate-500 italic">
            "{listing.subtitle}"
          </span>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Description</p>
        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
          {listing.description || 'No description provided'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Price"
          value={
            listing.price
              ? `${formatINR(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ''}${listing.priceType ? ` (${listing.priceType})` : ''}`
              : '—'
          }
        />
        <Field label="City" value={listing.city} />
        <Field label="Area / Locality" value={listing.area} />
        <Field label="Pincode" value={listing.pincode} />
        <Field label="Contact Phone" value={listing.contact || listing.contactPhone} />
        <Field label="Location / Landmark" value={listing.location} />
        <Field label="Submitted" value={formatDate(listing.createdAt)} />
        <Field label="Last Updated" value={formatDate(listing.updatedAt)} />
      </div>

      {catFields.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Category-Specific Specifications ({category?.label || typeKey})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {catFields.map((f) => {
              const val = listing[f.key];
              if (val === undefined || val === null || val === '') return null;
              return <Field key={f.key} label={f.label} value={String(val)} />;
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Images ({images.length})</p>
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
            <i className="fa-solid fa-image text-3xl mb-2" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider">No images uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={`${url}-${i}`} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {url ? (
                  <img
                    src={url}
                    alt={`listing-${i}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <i className="fa-solid fa-image text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {listing.adminComment && (
        <div className="rounded-2xl bg-brand-orange/5 border border-brand-orange/20 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-orange mb-1">Admin comment</p>
          <p className="text-sm font-medium text-slate-700">{listing.adminComment}</p>
        </div>
      )}
    </div>
  );
}