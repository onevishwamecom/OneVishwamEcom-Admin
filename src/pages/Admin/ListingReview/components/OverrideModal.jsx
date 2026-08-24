import AdminModal from '../../../../components/Admin/AdminModal';
import { COMMON_FIELDS, SUBCATEGORIES, CATEGORY_SPECIFIC_FIELDS, OVERRIDE_INPUT_CLASS } from '../constants';

export default function OverrideModal({
  open,
  onClose,
  listing,
  category,
  overrideForm,
  setOverrideForm,
  overrideImages,
  setOverrideImages,
  overrideFileRef,
  onConfirm,
}) {
  const typeKey = category?.id || listing?._type || listing?.category || 'properties';
  const subcategoryList = SUBCATEGORIES[typeKey] || SUBCATEGORIES[listing?.category] || [];
  const catFields = CATEGORY_SPECIFIC_FIELDS[typeKey] || CATEGORY_SPECIFIC_FIELDS[listing?.category] || [];

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Admin Override & Edit"
      subtitle="Review and edit listing information directly."
      icon="fa-pen-to-square"
      iconClass="bg-brand-blue/10 text-brand-blue"
      width="max-w-4xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-md shadow-brand-blue/20 transition-all"
          >
            <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
            Save Override
          </button>
        </>
      }
    >
      <div className="mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/25 p-4 text-sm font-medium text-brand-orange flex items-start gap-3">
        <i className="fa-solid fa-triangle-exclamation mt-0.5" aria-hidden="true" />
        <span>
          <strong>Admin Override:</strong> Changes made here update the database record directly and will be reflected on the public website once approved.
        </span>
      </div>

      <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
        {/* Basic Information Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-brand-blue" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor="override-title" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Title / Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="override-title"
                type="text"
                value={overrideForm.title || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, title: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="Listing title"
              />
            </div>

            {/* Subcategory dropdown */}
            <div>
              <label htmlFor="override-subcategory" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Subcategory
              </label>
              <select
                id="override-subcategory"
                value={overrideForm.subcategory || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, subcategory: e.target.value }))}
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
              <label htmlFor="override-subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                id="override-subtitle"
                type="text"
                value={overrideForm.subtitle || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="Short tagline"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="override-description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Description
              </label>
              <textarea
                id="override-description"
                rows={3}
                value={overrideForm.description || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, description: e.target.value }))}
                className={`${OVERRIDE_INPUT_CLASS} resize-none`}
                placeholder="Full details of the listing"
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-tag text-brand-gold" />
            Pricing & Commercials
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="override-price" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="override-price"
                type="text"
                value={overrideForm.price ?? ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, price: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. 5000000"
              />
            </div>

            <div>
              <label htmlFor="override-priceType" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Price Type
              </label>
              <select
                id="override-priceType"
                value={overrideForm.priceType || 'fixed'}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, priceType: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
              >
                <option value="fixed">Fixed Price</option>
                <option value="negotiable">Negotiable</option>
                <option value="per-month">Per Month (Rent/Lease)</option>
                <option value="per-year">Per Year</option>
                <option value="on-request">Price on Request</option>
              </select>
            </div>

            <div>
              <label htmlFor="override-priceSuffix" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Price Suffix
              </label>
              <input
                id="override-priceSuffix"
                type="text"
                value={overrideForm.priceSuffix || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, priceSuffix: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. / month, Cr"
              />
            </div>
          </div>
        </div>

        {/* Category-Specific Specifications */}
        {catFields.length > 0 && (
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-brand-orange" />
              Category Specifications ({category?.label || typeKey})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catFields.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`override-${f.key}`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    {f.label}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      id={`override-${f.key}`}
                      value={overrideForm[f.key] ?? listing[f.key] ?? ''}
                      onChange={(e) => setOverrideForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className={OVERRIDE_INPUT_CLASS}
                    >
                      <option value="">Select {f.label}</option>
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`override-${f.key}`}
                      type={f.type || 'text'}
                      value={overrideForm[f.key] ?? listing[f.key] ?? ''}
                      onChange={(e) => setOverrideForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder || ''}
                      className={OVERRIDE_INPUT_CLASS}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location & Contact Section */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-emerald-600" />
            Location & Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="override-city" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="override-city"
                type="text"
                value={overrideForm.city || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, city: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. bengaluru"
              />
            </div>

            <div>
              <label htmlFor="override-area" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Area / Locality
              </label>
              <input
                id="override-area"
                type="text"
                value={overrideForm.area || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, area: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. Indiranagar, Whitefield"
              />
            </div>

            <div>
              <label htmlFor="override-pincode" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Pincode
              </label>
              <input
                id="override-pincode"
                type="text"
                value={overrideForm.pincode || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, pincode: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. 560001"
              />
            </div>

            <div>
              <label htmlFor="override-contact" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Contact Phone
              </label>
              <input
                id="override-contact"
                type="text"
                value={overrideForm.contact || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, contact: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. 9876543210"
              />
            </div>

            <div>
              <label htmlFor="override-location" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Address / Landmark
              </label>
              <input
                id="override-location"
                type="text"
                value={overrideForm.location || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, location: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="e.g. Near Metro Station"
              />
            </div>
          </div>
        </div>

        {/* Media / Photos Section */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-images text-indigo-600" />
            Listing Photos ({overrideImages.length})
          </h4>
          {overrideImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {overrideImages.map((url, i) => (
                <div key={`${url}-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  {url ? (
                    <img src={url} alt={`image-${i}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <i className="fa-solid fa-image" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setOverrideImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow-md hover:bg-red-700 transition-colors"
                    aria-label="Remove image"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={overrideFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setOverrideImages((prev) => [...prev, URL.createObjectURL(file)]);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => overrideFileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true" />
            Add Image
          </button>
        </div>
      </div>
    </AdminModal>
  );
}