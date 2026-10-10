import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Uploads a file to structured Firebase Storage path and returns its public URL
 *
 * Structure: /{category}/{productId}/{mediaType}/{timestamp}_{sanitizedFilename}
 *
 * @param {Object} params
 * @param {string} params.category - e.g. 'properties', 'vehicles', 'garments'
 * @param {string} [params.productId] - MongoDB ObjectId or item ID
 * @param {'images'|'videos'|'documents'} [params.mediaType] - Media subfolder classification
 * @param {File|Blob} params.file - File or Blob to upload
 * @param {Function} [params.onProgress] - Optional upload progress callback (0-100)
 * @returns {Promise<string>} Public Firebase Storage download URL
 */
export async function uploadMediaToStorage({
  category = 'properties',
  productId = 'general',
  mediaType = 'images',
  file,
  onProgress,
}) {
  if (!file) throw new Error('No file provided for upload');

  const cleanCategory = String(category).toLowerCase().trim().replace(/\s+/g, '-');
  const cleanId = String(productId).trim() || `item_${Date.now()}`;
  const cleanType = String(mediaType).toLowerCase().trim();

  const fileName = file.name || `file_${Date.now()}.${file.type?.split('/')[1] || 'bin'}`;
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();

  const storagePath = `${cleanCategory}/${cleanId}/${cleanType}/${timestamp}_${sanitizedFileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0 && onProgress) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(progress);
        }
      },
      (error) => {
        console.error('⚠️ [FIREBASE STORAGE UPLOAD FAILED]:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });
}

/**
 * Deletes a file from Firebase Storage using its full URL or path
 * @param {string} fileUrl - Public URL or relative path of the file
 */
export async function deleteMediaFromStorage(fileUrl) {
  if (!fileUrl || !fileUrl.includes('firebasestorage')) return;
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn('⚠️ [FIREBASE STORAGE DELETE WARNING]:', err.message);
  }
}
