import { useState, useMemo, useCallback } from 'react';
import AdminModal from '../../../../components/Admin/AdminModal';
import { SUBCATEGORIES, getCategoryFields } from '../constants';
import {
  BasicListingFields,
  PricingListingFields,
  LocationListingFields,
  DynamicCategoryFields,
  MediaAttachmentsSection,
} from '../../components/ListingEditor';
import useListingMediaManager from '../../components/ListingEditor/useListingMediaManager';

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
  const typeKey = listing?._type || category?.id || 'properties';
  const subcategoryList = SUBCATEGORIES[typeKey] || [];
  const currentSubcategory = overrideForm?.subcategory || listing?.subcategory || '';
  const catFields = useMemo(
    () => getCategoryFields(typeKey, currentSubcategory),
    [typeKey, currentSubcategory]
  );

  const [saveLoading, setSaveLoading] = useState(false);

  const handleFieldChange = useCallback((key, value) => {
    setOverrideForm((prev) => ({ ...prev, [key]: value }));
  }, [setOverrideForm]);

  const onVideoUploaded = useCallback((url) => {
    setOverrideForm((prev) => ({ ...prev, videoUrl: url }));
  }, [setOverrideForm]);

  const onDocumentUploaded = useCallback((url) => {
    setOverrideForm((prev) => {
      const currentDocs = Array.isArray(prev.documents)
        ? prev.documents
        : (Array.isArray(listing?.documents) ? listing.documents : []);
      return {
        ...prev,
        pdfUrl: url,
        brochure: url,
        documents: Array.from(new Set([...currentDocs, url])),
      };
    });
  }, [listing, setOverrideForm]);

  const handleImagesChange = useCallback((newImages) => {
    setOverrideImages(newImages);
    setOverrideForm((prev) => ({
      ...prev,
      images: newImages,
      photos: newImages,
      details: {
        ...(typeof prev?.details === 'object' && prev.details !== null ? prev.details : {}),
        images: newImages,
        photos: newImages,
      },
    }));
  }, [setOverrideImages, setOverrideForm]);

  const {
    media,
    pendingUploads,
    handleMediaChange,
    handleFileUpload,
    handleFileSelect,
    handleVideoUpload,
    handleDocumentUpload,
    movePhoto,
    removePhoto,
    addPhotoUrl,
  } = useListingMediaManager({
    listing,
    typeKey,
    images: overrideImages,
    setImages: setOverrideImages,
    onImagesChange: handleImagesChange,
    onVideoUploaded,
    onDocumentUploaded,
  });

  const handleSave = useCallback(async () => {
    if (pendingUploads > 0) {
      alert('Please wait for file uploads to complete before saving.');
      return;
    }
    setSaveLoading(true);
    try {
      await onConfirm();
    } finally {
      setSaveLoading(false);
    }
  }, [onConfirm, pendingUploads]);

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
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveLoading || pendingUploads > 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-md shadow-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <BasicListingFields
          form={overrideForm}
          onChange={handleFieldChange}
          subcategoryList={subcategoryList}
          idPrefix="override"
        />

        <PricingListingFields
          form={overrideForm}
          onChange={handleFieldChange}
          typeKey={typeKey}
          idPrefix="override"
        />

        <DynamicCategoryFields
          catFields={catFields}
          form={overrideForm}
          listing={listing}
          onChange={handleFieldChange}
          categoryLabel={category?.label || typeKey}
          idPrefix="override"
        />

        <LocationListingFields
          form={overrideForm}
          onChange={handleFieldChange}
          idPrefix="override"
        />

        <MediaAttachmentsSection
          media={media}
          images={overrideImages}
          onMediaChange={handleMediaChange}
          movePhoto={movePhoto}
          removePhoto={removePhoto}
          addPhotoUrl={addPhotoUrl}
          onAddPhoto={handleFileUpload}
          onFileSelect={handleFileSelect}
          onVideoUpload={handleVideoUpload}
          onDocumentUpload={handleDocumentUpload}
          videoUrl={overrideForm.videoUrl}
          onVideoUrlChange={(val) => handleFieldChange('videoUrl', val)}
          pdfUrl={overrideForm.pdfUrl}
          onPdfUrlChange={(val) => handleFieldChange('pdfUrl', val)}
          pendingUploads={pendingUploads}
          idPrefix="override"
        />
      </div>
    </AdminModal>
  );
}