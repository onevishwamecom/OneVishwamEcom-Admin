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
  const isProp = typeKey === 'properties' || listing?._type === 'properties' || listing?.category === 'properties';
  const subcategoryList = SUBCATEGORIES[typeKey] || [];

  const [form, setForm] = useState(() => {
    if (!listing) return {};
    const resolvedType = listing.propertyType || listing.subcategory || '';
    const initialForm = {
      ...(listing.details || {}),
      ...listing,
    };
    if (isProp) {
      initialForm.propertyType = resolvedType;
      delete initialForm.subcategory;
    } else {
      initialForm.subcategory = listing.subcategory || '';
    }
    return initialForm;
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (listing) {
      const resolvedType = listing.propertyType || listing.subcategory || '';
      const updatedForm = {
        ...(listing.details || {}),
        ...listing,
      };
      if (isProp) {
        updatedForm.propertyType = resolvedType;
        delete updatedForm.subcategory;
      } else {
        updatedForm.subcategory = listing.subcategory || '';
      }
      setForm(updatedForm);
      if (listing.images?.length) {
        setImages(listing.images.filter((url) => !isBlobUrl(url)));
      } else {
        setImages([]);
      }
    }
  }, [listing, isProp]);

  const currentSubcategory = form?.propertyType || form?.subcategory || listing?.propertyType || listing?.subcategory || '';
  const catFields = useMemo(
    () => getCategoryFields(typeKey, currentSubcategory),
    [typeKey, currentSubcategory]
  );

  const handleFieldChange = useCallback((key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'subcategory' && isProp) {
        next.propertyType = value;
        delete next.subcategory;
      } else if (key === 'propertyType' && isProp) {
        next.propertyType = value;
        delete next.subcategory;
      }
      return next;
    });
  }, [isProp]);

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

  const handleImagesChange = useCallback((newImages) => {
    setImages(newImages);
    setForm((prev) => ({
      ...prev,
      images: newImages,
      photos: newImages,
      details: {
        ...(typeof prev?.details === 'object' && prev.details !== null ? prev.details : {}),
        images: newImages,
        photos: newImages,
      },
    }));
  }, []);

  const {
    media,
    pendingUploads,
    handleMediaChange,
    handleFileSelect,
    handleVideoUpload,
    handleDocumentUpload,
    movePhoto,
    removePhoto,
    addPhotoUrl,
  } = useListingMediaManager({
    listing,
    typeKey,
    images,
    setImages,
    onImagesChange: handleImagesChange,
    onVideoUploaded,
    onDocumentUploaded,
  });

  if (!open || !listing) return null;

  const handleSave = async () => {
    if (pendingUploads > 0) {
      alert('Please wait for file uploads to complete before saving.');
      return;
    }
    const cleanForm = {
      ...form,
      status: form.status && form.status !== 'pending' ? form.status : 'approved',
    };
    if (isProp) {
      const cleanPropType = form.propertyType || form.subcategory || listing.propertyType || 'Residential';
      cleanForm.propertyType = cleanPropType;
      if (cleanForm.details && typeof cleanForm.details === 'object') {
        cleanForm.details.propertyType = cleanPropType;
      }
      delete cleanForm.subcategory;
    }
    onConfirm(cleanForm, images);
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
          movePhoto={movePhoto}
          removePhoto={removePhoto}
          addPhotoUrl={addPhotoUrl}
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