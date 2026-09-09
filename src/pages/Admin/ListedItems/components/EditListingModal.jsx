import { useState, useEffect, useMemo, useCallback } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
import SortableMediaList from '../../../../components/ui/SortableMediaList';
import { COMMON_FIELDS, OVERRIDE_INPUT_CLASS } from '../../ListingReview/constants';
import client from '../../../../api/client';

const isBlobUrl = (url) => url?.startsWith('blob:');

const uploadBlobToCloudinary = async (blobUrl) => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('images', file);
  
  const res = await client.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const urls = res.data?.data?.images || res.data?.images || [];
  return urls[0];
};

export default function EditListingModal({ open, onClose, listing, category, onConfirm }) {
  const [form, setForm] = useState(() => {
    if (!listing) return {};
    const base = Object.fromEntries(COMMON_FIELDS.map((f) => [f.key, listing[f.key] ?? '']));
    const extra = category?.fields
      ? Object.fromEntries(category.fields.map((f) => [f.key, listing[f.key] ?? '']))
      : {};
    return { ...base, ...extra };
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);

  const media = useMemo(() => (images || []).map((url) => ({
    id: `media-${url}`,
    type: 'image',
    url,
    isExisting: !isBlobUrl(url),
  })), [images]);

  const handleMediaChange = useCallback((newMedia) => {
    const urls = newMedia.filter(m => m.url).map(m => m.url);
    setImages(urls);
  }, [setImages]);

  const handleFileUpload = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('images', file);
    
    setPendingUploads(prev => prev + 1);
    
    try {
      const response = await client.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls = response.data?.data?.images || response.data?.images || [];
      if (urls.length > 0) {
        setImages(prev => [...prev, urls[0]]);
      }
    } catch (err) {
      alert('Failed to upload image: ' + (err.response?.data?.message || err.message));
    } finally {
      setPendingUploads(prev => Math.max(0, prev - 1));
    }
  }, [setImages]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  }, [handleFileUpload]);

  useEffect(() => {
    if (listing?.images?.length) {
      const validUrls = listing.images.filter((url) => !isBlobUrl(url));
      setImages(validUrls);
    } else {
      setImages([]);
    }
  }, [listing]);

  if (!open || !listing) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (pendingUploads > 0) {
      alert('Please wait for image uploads to complete before saving.');
      return;
    }

    const blobUrls = images.filter(isBlobUrl);
    if (blobUrls.length > 0) {
      setUploading(true);
      try {
        const uploadedUrls = await Promise.all(blobUrls.map(uploadBlobToCloudinary));
        const finalImages = images.map((url) => {
          if (isBlobUrl(url)) {
            const idx = blobUrls.indexOf(url);
            return uploadedUrls[idx] || url;
          }
          return url;
        });
        onConfirm(form, finalImages);
      } catch (err) {
        console.error('Failed to upload blob images:', err);
        alert('Failed to upload some images. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      onConfirm(form, images);
    }
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
                {pendingUploads > 0 ? `Uploading ${pendingUploads} image${pendingUploads > 1 ? 's' : ''}...` : 'Uploading...'}
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
        <label className="block text-sm font-semibold text-slate-700 mb-2">Media</label>
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
            Uploading {pendingUploads} image{pendingUploads > 1 ? 's' : ''}...
          </p>
        )}
      </div>
    </AdminModal>
  );
}