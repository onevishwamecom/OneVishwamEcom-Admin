import { useState, useEffect, useMemo, useCallback } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
import { SUBCATEGORIES, getCategoryFields } from '../../ListingReview/constants';
import {
  BasicListingFields,
  PricingListingFields,
  LocationListingFields,
  DynamicCategoryFields,
  MediaAttachmentsSection,
} from '../../components/ListingEditor';
import useListingMediaManager from '../../components/ListingEditor/useListingMediaManager';

const isBlobUrl = (url) => url?.startsWith('blob:');

export default function EditListingModal({ open, onClose, listing, category, onConfirm }) {
  const typeKey = listing?._type || category?.id || 'properties';
  const subcategoryList = SUBCATEGORIES[typeKey] || [];

  const [form, setForm] = useState(() => {
    if (!listing) return {};
    return {
      ...(listing.details || {}),
      ...listing,
      subcategory: listing.subcategory || '',
    };
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (listing) {
      setForm({
        ...(listing.details || {}),
        ...listing,
        subcategory: listing.subcategory || '',
      });
      if (listing.images?.length) {
        setImages(listing.images.filter((url) => !isBlobUrl(url)));
      } else {
        setImages([]);
      }
    }
  }, [listing]);

  const catFields = useMemo(
    () => getCategoryFields(typeKey, form?.subcategory || listing?.subcategory || ''),
    [typeKey, form?.subcategory, listing?.subcategory]
  );

  const handleFieldChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onVideoUploaded = useCallback((url) => {
    setForm((prev) => ({ ...prev, videoUrl: url }));
  }, []);

  const onDocumentUploaded = useCallback((url) => {
    setForm((prev) => ({
      ...prev,
      pdfUrl: url,
      brochure: url,
      documents: [...(prev.documents || []), url],
    }));
  }, []);

  const {
    media,
    pendingUploads,
    handleMediaChange,
    handleFileSelect,
    handleVideoUpload,
    handleDocumentUpload,
  } = useListingMediaManager({
    listing,
    typeKey,
    images,
    setImages,
    onVideoUploaded,
    onDocumentUploaded,
  });

  if (!open || !listing) return null;

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
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={pendingUploads > 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {pendingUploads > 0 ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                Uploading {pendingUploads} file{pendingUploads > 1 ? 's' : ''}...
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
        <BasicListingFields
          form={form}
          onChange={handleFieldChange}
          subcategoryList={subcategoryList}
          idPrefix="edit"
        />

        <PricingListingFields
          form={form}
          onChange={handleFieldChange}
          typeKey={typeKey}
          idPrefix="edit"
        />

        <DynamicCategoryFields
          catFields={catFields}
          form={form}
          listing={listing}
          onChange={handleFieldChange}
          categoryLabel={form.subcategory || 'General'}
          idPrefix="edit"
        />

        <LocationListingFields
          form={form}
          onChange={handleFieldChange}
          idPrefix="edit"
        />

        <MediaAttachmentsSection
          media={media}
          images={images}
          onMediaChange={handleMediaChange}
          onFileSelect={handleFileSelect}
          onVideoUpload={handleVideoUpload}
          onDocumentUpload={handleDocumentUpload}
          videoUrl={form.videoUrl}
          onVideoUrlChange={(val) => handleFieldChange('videoUrl', val)}
          pdfUrl={form.pdfUrl}
          onPdfUrlChange={(val) => handleFieldChange('pdfUrl', val)}
          pendingUploads={pendingUploads}
          idPrefix="edit"
        />
      </div>
    </AdminModal>
  );
}