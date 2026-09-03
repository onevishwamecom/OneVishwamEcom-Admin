import { useRef, useState, useEffect } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
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
  const [uploadProgress, setUploadProgress] = useState({});
  const fileRef = useRef(null);

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

  const handleImageUpload = async (file) => {
    const fileId = `${file.name}-${Date.now()}`;
    const formData = new FormData();
    formData.append('images', file);

    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
    setUploading(true);

    try {
      const response = await client.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        },
      });

      const backendResponse = response.data;
      const urls = backendResponse?.data?.images || backendResponse?.images || [];

      if (urls.length > 0) {
        setImages((prev) => [...prev, urls[0]]);
      } else {
        throw new Error('No URL in upload response: ' + JSON.stringify(backendResponse));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      alert(`Failed to upload image: ${msg}`);
    } finally {
      setUploadProgress((prev) => {
        const next = { ...prev };
        delete next[fileId];
        return next;
      });
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
    e.target.value = '';
  };

  const handleSave = async () => {
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
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                Uploading...
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
        <label className="block text-sm font-semibold text-slate-700 mb-2">Images</label>
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
            {images.map((url, i) => {
              const isUploading = Object.values(uploadProgress).some((p) => p > 0 && p < 100);
              return (
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
                  {isBlobUrl(url) && (
                    <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                      Will re-upload
                    </span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-white text-sm font-medium">
                        <i className="fa-solid fa-spinner fa-spin mr-1" /> Uploading...
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    disabled={isUploading}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] shadow-sm hover:bg-brand-orange/90 disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-blue hover:text-brand-blue px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true" />
          Add image
        </button>
      </div>
    </AdminModal>
  );
}