import { formatINR, formatDate } from '../../../../utils';
import Field from './Field';

export default function ListingInfoCard({ listing, images, category }) {
  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-6">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
        <i className="fa-solid fa-file-lines text-brand-blue" aria-hidden="true" />
        Listing Information
      </h3>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Description</p>
        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
          {listing.description || 'No description provided'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Price" value={listing.price ? `${formatINR(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ''}` : '—'} />
        <Field label="Location" value={listing.location || listing.area || listing.city} />
        <Field label="City" value={listing.city} />
        <Field label="Area / Locality" value={listing.area} />
        <Field label="Pincode" value={listing.pincode} />
        <Field label="Contact" value={listing.contact} />
        <Field label="Submitted" value={formatDate(listing.createdAt)} />
        <Field label="Last Updated" value={formatDate(listing.updatedAt)} />
      </div>

      {category?.fields?.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Category-specific information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {category.fields.map((f) => (
              <Field key={f.key} label={f.label} value={listing[f.key]} />
            ))}
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
                  <img src={url} alt={`listing-${i}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><i className="fa-solid fa-image text-xl" /></div>
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