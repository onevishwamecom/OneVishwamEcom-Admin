import { useState, useEffect, useMemo, useCallback } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
import SortableMediaList from '../../../../components/ui/SortableMediaList';
import { COMMON_FIELDS, SUBCATEGORIES, OVERRIDE_INPUT_CLASS, getCategoryFields } from '../../ListingReview/constants';
import { uploadMediaToStorage, deleteMediaFromStorage } from '../../../../services/storageService';

const isBlobUrl = (url) => url?.startsWith('blob:');

export default function EditListingModal({ open, onClose, listing, category, onConfirm }) {
  const typeKey = category?.id || listing?._type || listing?.category || 'properties';
  const subcategoryList = SUBCATEGORIES[typeKey] || SUBCATEGORIES[listing?.category] || [];

  const [form, setForm] = useState(() => {
    if (!listing) return {};
    return {
      ...(listing.details || {}),
      ...listing,
      subcategory: listing.subcategory || listing.subCategory || listing.details?.subcategory || '',
    };
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);

  useEffect(() => {
    if (listing) {
      setForm({
        ...(listing.details || {}),
        ...listing,
        subcategory: listing.subcategory || listing.subCategory || listing.details?.subcategory || '',
      });
      if (listing.images?.length) {
        setImages(listing.images.filter((url) => !isBlobUrl(url)));
      } else {
        setImages([]);
      }
    }
  }, [listing]);

  const catFields = useMemo(
    () => getCategoryFields(typeKey, form?.subcategory || listing?.subcategory || listing?.subCategory),
    [typeKey, form?.subcategory, listing?.subcategory, listing?.subCategory]
  );

  const media = useMemo(() => (images || []).map((url) => ({
    id: `media-${url}`,
    type: 'image',
    url,
    isExisting: !isBlobUrl(url),
  })), [images]);

  const handleMediaChange = useCallback((newMedia) => {
    const urls = newMedia.filter(m => m.url).map(m => m.url);
    setImages(prev => {
      const prevUrls = prev || [];
      if (
        prevUrls.length === urls.length &&
        prevUrls.every((u, idx) => u === urls[idx])
      ) {
        return prev;
      }
      const removedUrls = prevUrls.filter(url => !urls.includes(url) && url?.includes('firebasestorage'));
      removedUrls.forEach(deleteMediaFromStorage);
      return urls;
    });
  }, [setImages]);

  const handleFileUpload = useCallback(async (file) => {
    setPendingUploads(prev => prev + 1);
    try {
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;
      const mediaType = file.type?.startsWith('video/') ? 'videos' : file.type?.includes('pdf') || file.type?.includes('officedocument') || file.type?.includes('msword') || file.type?.includes('excel') ? 'documents' : 'images';

      const downloadUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType,
        file,
      });

      if (downloadUrl) {
        if (mediaType === 'videos') {
          setForm(prev => ({ ...prev, videoUrl: downloadUrl, video: downloadUrl, videos: [downloadUrl] }));
        } else if (mediaType === 'documents') {
          setForm(prev => ({
            ...prev,
            pdfUrl: downloadUrl,
            brochure: downloadUrl,
            documents: [...(prev.documents || []), downloadUrl],
          }));
        } else {
          setImages(prev => [...prev, downloadUrl]);
        }
      }
    } catch (err) {
      alert('Failed to upload file to Firebase Storage: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads(prev => Math.max(0, prev - 1));
    }
  }, [listing, typeKey]);

  const handleVideoUpload = useCallback(async (file) => {
    if (!file) return;
    setPendingUploads((prev) => prev + 1);
    try {
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;
      const downloadUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType: 'videos',
        file,
      });
      if (downloadUrl) {
        setForm((prev) => ({
          ...prev,
          videoUrl: downloadUrl,
          video: downloadUrl,
          videos: [downloadUrl],
        }));
      }
    } catch (err) {
      alert('Failed to upload video: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey]);

  const handleDocumentUpload = useCallback(async (file) => {
    if (!file) return;
    setPendingUploads((prev) => prev + 1);
    try {
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;
      const downloadUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType: 'documents',
        file,
      });
      if (downloadUrl) {
        setForm((prev) => ({
          ...prev,
          pdfUrl: downloadUrl,
          brochure: downloadUrl,
          documents: [...(prev.documents || []), downloadUrl],
        }));
      }
    } catch (err) {
      alert('Failed to upload document: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  }, [handleFileUpload]);

  if (!open || !listing) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (pendingUploads > 0) {
      alert('Please wait for file uploads to complete before saving.');
      return;
    }

    onConfirm(form, images);
  };

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
            onClick={handleSave}
            disabled={uploading || pendingUploads > 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading || pendingUploads > 0 ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                {pendingUploads > 0 ? `Uploading ${pendingUploads} file${pendingUploads > 1 ? 's' : ''}...` : 'Uploading...'}
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
                Save Changes
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-brand-blue" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="edit-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Title / Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                value={form.title ?? ''}
                onChange={set('title')}
                className={OVERRIDE_INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="edit-subcategory" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Subcategory
              </label>
              <select
                id="edit-subcategory"
                value={form.subcategory ?? ''}
                onChange={set('subcategory')}
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

            <div>
              <label htmlFor="edit-subtitle" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                id="edit-subtitle"
                type="text"
                value={form.subtitle ?? ''}
                onChange={set('subtitle')}
                className={OVERRIDE_INPUT_CLASS}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="edit-description" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                id="edit-description"
                rows={3}
                value={form.description ?? ''}
                onChange={set('description')}
                className={`${OVERRIDE_INPUT_CLASS} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="edit-price" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-price"
                type="number"
                value={form.price ?? ''}
                onChange={set('price')}
                className={OVERRIDE_INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="edit-priceType" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Price Type
              </label>
              <select
                id="edit-priceType"
                value={form.priceType ?? ''}
                onChange={set('priceType')}
                className={OVERRIDE_INPUT_CLASS}
              >
                <option value="fixed">Fixed Price</option>
                <option value="negotiable">Negotiable</option>
                <option value="per-month">Per Month (Rent/Lease)</option>
                <option value="per-year">Per Year</option>
                <option value="on-request">Price on Request</option>
              </select>
            </div>
          </div>
        </div>

        {catFields && catFields.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-brand-blue" />
              Category Specific Details ({form.subcategory || 'General'})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catFields.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`edit-${f.key}`} className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {f.label}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      id={`edit-${f.key}`}
                      value={form[f.key] ?? ''}
                      onChange={set(f.key)}
                      className={OVERRIDE_INPUT_CLASS}
                    >
                      <option value="">Select {f.label}</option>
                      {f.options?.map((opt) => (
                        <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                          {typeof opt === 'object' ? opt.label : opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`edit-${f.key}`}
                      type={f.type || 'text'}
                      placeholder={f.placeholder || ''}
                      value={form[f.key] ?? ''}
                      onChange={set(f.key)}
                      className={OVERRIDE_INPUT_CLASS}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Media Images</label>
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
            id="edit-media-upload"
          />
          <button
            type="button"
            onClick={() => document.getElementById('edit-media-upload')?.click()}
            disabled={pendingUploads > 0 || (images?.length || 0) >= 6}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Video Upload Section */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-video text-rose-500" />
            Video Attachment (Upload or Paste Link)
          </h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={form.videoUrl || form.video || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value, video: e.target.value, videos: [e.target.value] }))}
                className={OVERRIDE_INPUT_CLASS}
                placeholder="Paste Video URL (MP4, YouTube, Vimeo) or upload below"
              />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                id="edit-video-upload"
                onChange={(e) => {
                  if (e.target.files[0]) handleVideoUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-video-upload')?.click()}
                disabled={pendingUploads > 0}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-file-video text-rose-500" />
                Upload Video
              </button>
            </div>

            {(form.videoUrl || form.video) && (
              <div className="relative rounded-2xl overflow-hidden bg-black/90 p-2 max-w-md">
                <video
                  src={form.videoUrl || form.video}
                  controls
                  className="w-full h-40 object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentUrl = form.videoUrl || form.video;
                    if (currentUrl?.includes('firebasestorage')) deleteMediaFromStorage(currentUrl);
                    setForm((prev) => ({ ...prev, videoUrl: '', video: '', videos: [] }));
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

        {/* Documents & Brochure Section */}
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
                id="edit-doc-upload"
                onChange={(e) => {
                  if (e.target.files[0]) handleDocumentUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-doc-upload')?.click()}
                disabled={pendingUploads > 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-brand-blue hover:text-brand-blue text-xs font-bold text-slate-700 transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-cloud-arrow-up text-amber-500" />
                Upload Document / Brochure
              </button>
            </div>

            {((form.pdfUrl || form.brochure) || (Array.isArray(form.documents) && form.documents.length > 0)) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  ...(form.pdfUrl || form.brochure ? [{ url: form.pdfUrl || form.brochure, label: 'Brochure (PDF)', isBrochure: true }] : []),
                  ...(Array.isArray(form.documents) ? form.documents.map((d, i) => ({ url: d, label: `Document ${i + 1}`, isBrochure: false })) : []),
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
                          setForm((prev) => ({ ...prev, pdfUrl: '', brochure: '' }));
                        } else {
                          setForm((prev) => ({
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