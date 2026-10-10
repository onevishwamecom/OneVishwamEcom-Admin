import { useState, useMemo, useCallback } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
import SortableMediaList from '../../../../components/ui/SortableMediaList';
import { SUBCATEGORIES, CATEGORY_SPECIFIC_FIELDS, PRICE_UNITS, PRICE_SUFFIXES_BY_CATEGORY, OVERRIDE_INPUT_CLASS, getCategoryFields } from '../constants';
import client from '../../../../api/client';
import { uploadMediaToStorage, deleteMediaFromStorage } from '../../../../services/storageService';

export default function OverrideModal({
  open,
  onClose,
  listing,
  category,
  overrideForm,
  setOverrideForm,
  overrideImages,
  setOverrideImages,
  onConfirm,
}) {
  const typeKey = category?.id || listing?._type || listing?.category || 'properties';
  const subcategoryList = SUBCATEGORIES[typeKey] || SUBCATEGORIES[listing?.category] || [];
  const catFields = useMemo(
    () => getCategoryFields(typeKey, overrideForm?.subcategory || listing?.subcategory || listing?.subCategory),
    [typeKey, overrideForm?.subcategory, listing?.subcategory, listing?.subCategory]
  );
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);

  // Create stable media items with persistent IDs based on URL
  const media = useMemo(() => (overrideImages || []).map((url) => ({
    id: `media-${url}`, // Stable ID based on URL
    type: 'image',
    url,
    isExisting: true,
  })), [overrideImages]);

  const handleMediaChange = useCallback((newMedia) => {
    const newUrls = newMedia.filter(m => m.url).map(m => m.url);
    setOverrideImages(prev => {
      const prevUrls = prev || [];
      if (
        prevUrls.length === newUrls.length &&
        prevUrls.every((u, idx) => u === newUrls[idx])
      ) {
        return prev;
      }
      const removedUrls = prevUrls.filter(url => !newUrls.includes(url) && url?.includes('firebasestorage'));
      removedUrls.forEach(deleteMediaFromStorage);
      return newUrls;
    });
  }, [setOverrideImages]);

  const handleFileUpload = useCallback(async (file) => {
    setPendingUploads(prev => prev + 1);
    
    try {
      const mediaType = file.type?.startsWith('video/') ? 'videos' : 'images';
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;
      const downloadUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType,
        file,
      });

      if (downloadUrl) {
        setOverrideImages(prev => [...prev, downloadUrl]);
      }
    } catch (err) {
      alert('Failed to upload image: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads(prev => Math.max(0, prev - 1));
    }
  }, [listing, typeKey, setOverrideImages]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  }, [handleFileUpload]);

  const handleVideoUpload = useCallback(async (file) => {
    if (!file) return;
    setPendingUploads((prev) => prev + 1);
    try {
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;
      const videoUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType: 'videos',
        file,
      });
      if (videoUrl) {
        setOverrideForm((prev) => ({
          ...prev,
          videoUrl,
          video: videoUrl,
          videos: [videoUrl],
        }));
      }
    } catch (err) {
      alert('Failed to upload video: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey, setOverrideForm]);

  const handleDocumentUpload = useCallback(async (file) => {
    if (!file) return;
    setPendingUploads((prev) => prev + 1);
    try {
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;
      const docUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType: 'documents',
        file,
      });
      if (docUrl) {
        setOverrideForm((prev) => {
          const currentDocs = Array.isArray(prev.documents) ? prev.documents : (Array.isArray(listing?.documents) ? listing.documents : []);
          return {
            ...prev,
            pdfUrl: docUrl,
            brochure: docUrl,
            documents: Array.from(new Set([...currentDocs, docUrl])),
          };
        });
      }
    } catch (err) {
      alert('Failed to upload document: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey, setOverrideForm]);

  const handleSave = useCallback(async () => {
    setSaveLoading(true);
    try {
      await onConfirm();
    } finally {
      setSaveLoading(false);
    }
  }, [onConfirm]);

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
            onClick={handleSave}
            disabled={saveLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-md shadow-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
                Save Override
              </>
            )}
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

      <div className="space-y-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="override-price" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-sm">₹</span>
                </div>
                <input
                  id="override-price"
                  type="text"
                  value={overrideForm.price ?? ''}
                  onChange={(e) => setOverrideForm((prev) => ({ ...prev, price: e.target.value }))}
                  className={`${OVERRIDE_INPUT_CLASS} pl-8`}
                  placeholder="e.g. 4.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="override-priceUnit" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Unit
              </label>
              <select
                id="override-priceUnit"
                value={overrideForm.priceUnit || 'exact'}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, priceUnit: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
              >
                {PRICE_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
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
              <select
                id="override-priceSuffix"
                value={overrideForm.priceSuffix || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, priceSuffix: e.target.value }))}
                className={OVERRIDE_INPUT_CLASS}
              >
                {(PRICE_SUFFIXES_BY_CATEGORY[typeKey] || ['', '/ month', '/ year', 'Onwards']).map((s) => (
                  <option key={s} value={s}>{s || '(None)'}</option>
                ))}
              </select>
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
                      value={overrideForm[f.key] ?? listing?.details?.[f.key] ?? listing?.[f.key] ?? ''}
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
                      value={overrideForm[f.key] ?? listing?.details?.[f.key] ?? listing?.[f.key] ?? ''}
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
            Media ({overrideImages.length})
          </h4>
          <SortableMediaList
            media={media}
            onMediaChange={handleMediaChange}
            maxMedia={6}
            accept="image/*,video/*"
            disabled={false}
            showMainBadge={true}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            id="override-media-upload"
          />
          <button
            type="button"
            onClick={() => document.getElementById('override-media-upload')?.click()}
            disabled={pendingUploads > 0 || (overrideImages?.length || 0) >= 6}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true" />
            Add Image
          </button>
          {pendingUploads > 0 && (
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin text-brand-blue" />
              Uploading {pendingUploads} file{pendingUploads > 1 ? 's' : ''}...
            </p>
          )}
        </div>

        {/* Video Section */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-video text-rose-500" />
            Video Presentation
          </h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={overrideForm.videoUrl || overrideForm.video || ''}
                onChange={(e) => setOverrideForm((prev) => ({ ...prev, videoUrl: e.target.value, video: e.target.value, videos: [e.target.value] }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="Paste Video URL (MP4, YouTube, Vimeo) or upload below"
              />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                id="override-video-upload"
                onChange={(e) => {
                  if (e.target.files[0]) handleVideoUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('override-video-upload')?.click()}
                disabled={pendingUploads > 0}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-file-video text-rose-500" />
                Upload Video
              </button>
            </div>

            {(overrideForm.videoUrl || overrideForm.video) && (
              <div className="relative rounded-2xl overflow-hidden bg-black/90 p-2 max-w-md">
                <video
                  src={overrideForm.videoUrl || overrideForm.video}
                  controls
                  className="w-full h-40 object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentUrl = overrideForm.videoUrl || overrideForm.video;
                    if (currentUrl?.includes('firebasestorage')) deleteMediaFromStorage(currentUrl);
                    setOverrideForm((prev) => ({ ...prev, videoUrl: '', video: '', videos: [] }));
                  }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-md text-xs"
                  title="Remove Video"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Supporting Documents & Brochure Section */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-file-pdf text-amber-500" />
            Documents & Brochure (PDF / Docs)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                id="override-doc-upload"
                onChange={(e) => {
                  if (e.target.files[0]) handleDocumentUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('override-doc-upload')?.click()}
                disabled={pendingUploads > 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-brand-blue hover:text-brand-blue text-xs font-bold text-slate-700 transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-cloud-arrow-up text-amber-500" />
                Upload Document / Brochure
              </button>
            </div>

            {/* List attached documents & brochure */}
            {((overrideForm.pdfUrl || overrideForm.brochure) || (Array.isArray(overrideForm.documents) && overrideForm.documents.length > 0)) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  ...(overrideForm.pdfUrl || overrideForm.brochure ? [{ url: overrideForm.pdfUrl || overrideForm.brochure, label: 'Brochure (PDF)', isBrochure: true }] : []),
                  ...(Array.isArray(overrideForm.documents) ? overrideForm.documents.map((d, i) => ({ url: d, label: `Document ${i + 1}`, isBrochure: false })) : []),
                ].map((docItem, idx) => (
                  <div key={`${docItem.url}-${idx}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                    <i className="fa-solid fa-file-pdf text-red-500" />
                    <a href={docItem.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-brand-blue truncate max-w-[180px]">
                      {docItem.label}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (docItem.url.includes('firebasestorage')) deleteMediaFromStorage(docItem.url);
                        if (docItem.isBrochure) {
                          setOverrideForm((prev) => ({ ...prev, pdfUrl: '', brochure: '' }));
                        } else {
                          setOverrideForm((prev) => ({
                            ...prev,
                            documents: (prev.documents || []).filter((u) => u !== docItem.url),
                          }));
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                      title="Remove document"
                    >
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}