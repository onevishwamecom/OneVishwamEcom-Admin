import { formatINR, formatDate } from '../../../../utils';
import { CATEGORY_SPECIFIC_FIELDS } from '../constants';
import Field from './Field';

export default function ListingInfoCard({ listing, images, category }) {
  const typeKey = category?.id || listing?._type || listing?.category || 'properties';
  const catFields = CATEGORY_SPECIFIC_FIELDS[typeKey] || category?.fields || [];

  const rawSub = String(listing?.subcategory || listing?.subCategory || listing?.propertyType || '').toLowerCase();
  const displaySubcategory = (() => {
    if (rawSub.includes('plot') || rawSub.includes('site') || rawSub.includes('land')) return 'Plot';
    if (rawSub.includes('villa')) return 'Villa';
    if (rawSub.includes('flat') || rawSub.includes('apartment') || rawSub.includes('house') || rawSub.length > 0) return 'Flat';
    return listing?.subcategory || listing?.subCategory || null;
  })();

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
        {displaySubcategory && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Subcategory: {displaySubcategory}
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
        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4 whitespace-pre-line">
          {listing.details || listing.description || 'No description provided'}
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
        <Field label="Area / Locality" value={listing.area || listing.area_sqft} />
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
              const displayVal = f.key === 'loanApproved' ? (val === true || val === 'Yes' ? 'Yes' : 'No') : String(val);
              return <Field key={f.key} label={f.label} value={displayVal} />;
            })}
          </div>
        </div>
      )}

      {(() => {
        const brochureLink = listing.brochure || listing.pdfUrl || listing.floorPlanPdf || listing.pdf;
        const docsList = Array.isArray(listing.documents)
          ? listing.documents
          : (listing.documents ? [listing.documents] : []);

        if (!brochureLink && docsList.length === 0) return null;

        return (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Brochure & Documents</p>
            <div className="flex flex-wrap gap-2">
              {brochureLink && (
                <a
                  href={brochureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors text-xs font-semibold"
                >
                  <i className="fa-solid fa-file-pdf text-red-500" /> View Project Brochure
                </a>
              )}
              {docsList.map((doc, idx) => {
                const url = typeof doc === 'string' ? doc : doc.url;
                if (!url) return null;
                const name = typeof doc === 'string' ? `Document ${idx + 1}` : doc.name || `Document ${idx + 1}`;
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors text-xs font-medium"
                  >
                    <i className="fa-solid fa-file-lines text-slate-500" /> {name}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })()}

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

      {(() => {
        const videoLink = listing.video || (Array.isArray(listing.videos) && listing.videos[0]);
        if (!videoLink) return null;
        return (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-video text-brand-blue" /> Video Preview
            </p>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video max-w-md shadow-sm">
              <video src={videoLink} controls className="w-full h-full object-contain" />
            </div>
          </div>
        );
      })()}

      {listing.adminComment && (
        <div className="rounded-2xl bg-brand-orange/5 border border-brand-orange/20 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-orange mb-1">Admin comment</p>
          <p className="text-sm font-medium text-slate-700">{listing.adminComment}</p>
        </div>
      )}
    </div>
  );
}