import { useRef, useState } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
import { COMMON_FIELDS, OVERRIDE_INPUT_CLASS } from '../../ListingReview/constants';

export default function EditListingModal({ open, onClose, listing, category, onConfirm }) {
  const [form, setForm] = useState(() => {
    if (!listing) return {};
    const base = Object.fromEntries(COMMON_FIELDS.map((f) => [f.key, listing[f.key] ?? '']));
    const extra = category?.fields
      ? Object.fromEntries(category.fields.map((f) => [f.key, listing[f.key] ?? '']))
      : {};
    return { ...base, ...extra };
  });
  const [images, setImages] = useState(() => (listing?.images?.length ? [...listing.images] : []));
  const fileRef = useRef(null);

  if (!open || !listing) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Edit Listed Item"
      subtitle="Update the product information shown on the live site."
      icon="fa-pen-to-square"
      iconClass="bg-brand-blue/10 text-brand-blue"
      width="max-w-3xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(form, images)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 transition-colors"
          >
            <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
            Save Changes
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMMON_FIELDS.map((f) => (
          <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <label htmlFor={`edit-${f.key}`} className="block text-sm font-semibold text-slate-700 mb-1.5">
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                id={`edit-${f.key}`}
                rows={3}
                value={form[f.key] ?? ''}
                onChange={set(f.key)}
                className={`${OVERRIDE_INPUT_CLASS} resize-none`}
              />
            ) : (
              <input
                id={`edit-${f.key}`}
                type={f.type}
                value={form[f.key] ?? ''}
                onChange={set(f.key)}
                className={OVERRIDE_INPUT_CLASS}
              />
            )}
          </div>
        ))}

        {category?.fields?.map((f) => (
          <div key={f.key}>
            <label htmlFor={`edit-${f.key}`} className="block text-sm font-semibold text-slate-700 mb-1.5">
              {f.label}
            </label>
            <input
              id={`edit-${f.key}`}
              type="text"
              value={form[f.key] ?? ''}
              onChange={set(f.key)}
              className={OVERRIDE_INPUT_CLASS}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Images</label>
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
            {images.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
              >
                {url ? (
                  <img src={url} alt={`image-${i}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <i className="fa-solid fa-image" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] shadow-sm hover:bg-brand-orange/90"
                  aria-label="Remove image"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setImages((prev) => [...prev, URL.createObjectURL(file)]);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-blue hover:text-brand-blue px-4 py-2.5 text-sm font-bold transition-colors"
        >
          <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true" />
          Add image
        </button>
      </div>
    </AdminModal>
  );
}