import { useState, useMemo, useCallback } from 'react';
import { uploadMediaToStorage, deleteMediaFromStorage } from '../../../../services/storageService';

const isBlobUrl = (url) => url?.startsWith('blob:');

export default function useListingMediaManager({
  listing,
  typeKey = 'properties',
  images = [],
  setImages,
  onImagesChange,
  onVideoUploaded,
  onDocumentUploaded,
}) {
  const [pendingUploads, setPendingUploads] = useState(0);

  // Stable media list for SortableMediaList
  const media = useMemo(() => (images || []).map((url) => ({
    id: `media-${url}`,
    type: 'image',
    url,
    isExisting: !isBlobUrl(url),
  })), [images]);

  const handleMediaChange = useCallback((newMedia) => {
    const newUrls = newMedia.filter((m) => m.url).map((m) => m.url);
    setImages((prev) => {
      const prevUrls = prev || [];
      if (
        prevUrls.length === newUrls.length &&
        prevUrls.every((u, idx) => u === newUrls[idx])
      ) {
        return prev;
      }
      const removedUrls = prevUrls.filter((url) => !newUrls.includes(url) && url?.includes('firebasestorage'));
      removedUrls.forEach(deleteMediaFromStorage);
      onImagesChange?.(newUrls);
      return newUrls;
    });
  }, [setImages, onImagesChange]);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    setPendingUploads((prev) => prev + 1);

    try {
      const isVideo = file.type?.startsWith('video/');
      const isDoc = file.type?.includes('pdf') || file.type?.includes('officedocument') || file.type?.includes('msword') || file.type?.includes('excel');
      const mediaType = isVideo ? 'videos' : (isDoc ? 'documents' : 'images');
      const productId = listing?._id || listing?.id || `item_${Date.now()}`;

      const downloadUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType,
        file,
      });

      if (downloadUrl) {
        if (mediaType === 'videos') {
          onVideoUploaded?.(downloadUrl);
        } else if (mediaType === 'documents') {
          onDocumentUploaded?.(downloadUrl);
        } else {
          setImages((prev) => {
            const next = [...prev, downloadUrl].slice(0, 5);
            onImagesChange?.(next);
            return next;
          });
        }
      }
    } catch (err) {
      alert('Failed to upload file to Firebase Storage: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey, setImages, onImagesChange, onVideoUploaded, onDocumentUploaded]);

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
      const downloadUrl = await uploadMediaToStorage({
        category: typeKey,
        productId,
        mediaType: 'videos',
        file,
      });
      if (downloadUrl) {
        onVideoUploaded?.(downloadUrl);
      }
    } catch (err) {
      alert('Failed to upload video: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey, onVideoUploaded]);

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
        onDocumentUploaded?.(downloadUrl);
      }
    } catch (err) {
      alert('Failed to upload document: ' + (err.message || 'Upload error'));
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
    }
  }, [listing, typeKey, onDocumentUploaded]);

  const movePhoto = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setImages((prev) => {
      const list = prev || [];
      if (toIndex < 0 || toIndex >= list.length || fromIndex < 0 || fromIndex >= list.length) return list;
      const next = [...list];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      onImagesChange?.(next);
      return next;
    });
  }, [setImages, onImagesChange]);

  const removePhoto = useCallback((index) => {
    setImages((prev) => {
      const list = prev || [];
      const removed = list[index];
      if (removed && removed.includes('firebasestorage')) {
        deleteMediaFromStorage(removed);
      }
      const next = list.filter((_, idx) => idx !== index);
      onImagesChange?.(next);
      return next;
    });
  }, [setImages, onImagesChange]);

  const addPhotoUrl = useCallback((url) => {
    const trimmed = (url || '').trim();
    if (!trimmed) return;
    setImages((prev) => {
      const list = prev || [];
      if (list.length >= 5) return list;
      const next = [...list, trimmed];
      onImagesChange?.(next);
      return next;
    });
  }, [setImages, onImagesChange]);

  return {
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
  };
}
