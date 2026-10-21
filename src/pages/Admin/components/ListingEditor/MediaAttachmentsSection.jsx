import React from 'react';
import SortableMediaList from '../../../../components/ui/SortableMediaList';
import { OVERRIDE_INPUT_CLASS } from '../../ListingReview/constants';
import { deleteMediaFromStorage } from '../../../../services/storageService';

export default function MediaAttachmentsSection({
  media = [],
  images = [],
  onMediaChange,
  onFileSelect,
  onVideoUpload,
  onDocumentUpload,
  videoUrl = '',
  onVideoUrlChange,
  pdfUrl = '',
  onPdfUrlChange,
  pendingUploads = 0,
  idPrefix = 'override',
}) {
  return (
    <>
      {/* Media / Photos Section */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-images text-indigo-600" />
          Media ({images.length})
        </h4>
        <SortableMediaList
          media={media}
          onMediaChange={onMediaChange}
          maxMedia={6}
          accept="image/*,video/*"
          disabled={false}
          showMainBadge={true}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileSelect}
          id={`${idPrefix}-media-upload`}
        />
        <button
          type="button"
          onClick={() => document.getElementById(`${idPrefix}-media-upload`)?.click()}
          disabled={pendingUploads > 0 || (images?.length || 0) >= 6}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              value={videoUrl || ''}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              className={OVERRIDE_INPUT_CLASS}
              placeholder="Paste Video URL (MP4, YouTube, Vimeo) or upload below"
            />
            <input
              type="file"
              accept="video/*"
              className="hidden"
              id={`${idPrefix}-video-upload`}
              onChange={(e) => {
                if (e.target.files[0]) onVideoUpload(e.target.files[0]);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById(`${idPrefix}-video-upload`)?.click()}
              disabled={pendingUploads > 0}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <i className="fa-solid fa-file-video text-rose-500" />
              Upload Video
            </button>
          </div>

          {videoUrl && (
            <div className="relative rounded-2xl overflow-hidden bg-black/90 p-2 max-w-md">
              <video
                src={videoUrl}
                controls
                className="w-full h-40 object-cover rounded-xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => {
                  if (videoUrl?.includes('firebasestorage')) deleteMediaFromStorage(videoUrl);
                  onVideoUrlChange('');
                }}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-md text-xs cursor-pointer"
                title="Remove Video"
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brochure / Documents Section */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-file-pdf text-amber-500" />
          Brochure / Documents (PDF)
        </h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={pdfUrl || ''}
              onChange={(e) => onPdfUrlChange(e.target.value)}
              className={OVERRIDE_INPUT_CLASS}
              placeholder="Paste Brochure/Document PDF link or upload below"
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id={`${idPrefix}-doc-upload`}
              onChange={(e) => {
                if (e.target.files[0]) onDocumentUpload(e.target.files[0]);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById(`${idPrefix}-doc-upload`)?.click()}
              disabled={pendingUploads > 0}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <i className="fa-solid fa-file-arrow-up text-amber-500" />
              Upload PDF
            </button>
          </div>

          {pdfUrl && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/60 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold truncate mr-2">
                <i className="fa-solid fa-file-pdf text-base text-amber-600 shrink-0" />
                <span className="truncate">{pdfUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (pdfUrl?.includes('firebasestorage')) deleteMediaFromStorage(pdfUrl);
                  onPdfUrlChange('');
                }}
                className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded cursor-pointer"
                title="Remove Document"
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
