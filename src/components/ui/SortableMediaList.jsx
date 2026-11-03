import React, { useRef, useState, useMemo } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';

function DndSortablePhotoItem({
  id,
  idx,
  item,
  isFirst,
  photosLength,
  onRemovePhoto,
  onMovePhoto,
  disabled,
}) {
  const { ref, isDragging, isDropTarget } = useSortable({ id, index: idx, disabled });

  const isObject = typeof item === 'object' && item !== null && !(item instanceof File);
  const isVideo = isObject && (item.type === 'video' || item.url?.includes('.mp4') || item.url?.includes('.webm'));
  const url = typeof item === 'string'
    ? item
    : item instanceof File
    ? URL.createObjectURL(item)
    : item?.url || item?.preview;

  const isLink = Boolean(
    isObject
      ? item.isDirectLink || (!item.file && url && !url.startsWith('blob:') && !url.includes('firebasestorage'))
      : typeof item === 'string' && !item.includes('firebasestorage') && !item.startsWith('blob:')
  );

  return (
    <div
      ref={ref}
      className={`relative group aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
        isDragging
          ? 'opacity-40 border-dashed border-brand-blue scale-95 shadow-lg'
          : isDropTarget
          ? 'border-brand-blue ring-2 ring-brand-blue/30 scale-102'
          : isFirst
          ? 'border-amber-400 ring-2 ring-amber-400/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {isVideo ? (
        <video
          src={url}
          className="w-full h-full object-cover pointer-events-none"
          muted
          playsInline
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <img
          src={url}
          alt={`Media ${idx + 1}`}
          className="w-full h-full object-cover pointer-events-none select-none"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      {/* Top-Right Remove Button */}
      {!disabled && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemovePhoto?.(idx);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] shadow-sm cursor-pointer z-20 hover:bg-red-700 active:scale-95"
          title="Remove Photo"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}

      {/* Sequence Badge */}
      <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none flex flex-col gap-1 items-start">
        {isFirst ? (
          <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <i className="fa-solid fa-star text-[8px]" />
            <span>1st · Cover</span>
          </span>
        ) : (
          <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {idx + 1}{idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}
          </span>
        )}

        {isLink && (
          <span className="bg-indigo-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
            <i className="fa-solid fa-link text-[7px]" /> Link
          </span>
        )}
      </div>

      {/* Hover Swap & Reorder Overlay */}
      {!disabled && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-between pointer-events-auto"
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={idx === 0}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMovePhoto?.(idx, idx - 1);
              }}
              title="Move Left / Forward"
              className="w-5 h-5 rounded bg-white/90 text-slate-700 hover:bg-white hover:text-brand-blue flex items-center justify-center text-[9px] shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-transform active:scale-90"
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            <button
              type="button"
              disabled={idx === photosLength - 1}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMovePhoto?.(idx, idx + 1);
              }}
              title="Move Right / Backward"
              className="w-5 h-5 rounded bg-white/90 text-slate-700 hover:bg-white hover:text-brand-blue flex items-center justify-center text-[9px] shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-transform active:scale-90"
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>

          {!isFirst && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMovePhoto?.(idx, 0);
              }}
              title="Set as 1st (Primary Cover)"
              className="px-1.5 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-900 text-[8px] font-extrabold flex items-center gap-1 shadow-sm cursor-pointer transition-transform active:scale-95"
            >
              <i className="fa-solid fa-star text-[7px]" />
              <span>Cover</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Modern SortableMediaList replicated from Vishwam-Listings MediaUploadSection.
 * Eliminates jump-to-last bugs, uses direct state callbacks with @dnd-kit/react,
 * and includes sleek hover overlay swap buttons, direct link input, and dropzone.
 */
export default function SortableMediaList({
  photos = [],
  media = [],
  images = [],
  onMovePhoto,
  onRemovePhoto,
  onAddPhoto,
  onAddPhotoUrl,
  onMediaChange,
  pendingUploads = 0,
  maxPhotos = 5,
  disabled = false,
  className = '',
  idPrefix = 'media',
}) {
  const fileInputRef = useRef(null);
  const [photoDragOver, setPhotoDragOver] = useState(false);
  const [directUrlInput, setDirectUrlInput] = useState('');

  // Unify photo items whether passed as photos, images, or media
  const photoList = useMemo(() => {
    if (photos && photos.length > 0) return photos;
    if (images && images.length > 0) return images;
    if (media && media.length > 0) return media;
    return [];
  }, [photos, images, media]);

  const isMaxPhotos = photoList.length >= maxPhotos;

  const handleMove = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    if (onMovePhoto) {
      onMovePhoto(fromIndex, toIndex);
    }
    if (onMediaChange) {
      const next = [...photoList];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      onMediaChange(
        next.map((item) =>
          typeof item === 'string'
            ? { id: `media-${item}`, url: item, type: 'image' }
            : item
        )
      );
    }
  };

  const handleRemove = (index) => {
    if (onRemovePhoto) {
      onRemovePhoto(index);
      return;
    }
    if (onMediaChange) {
      const next = photoList.filter((_, idx) => idx !== index);
      onMediaChange(
        next.map((item) =>
          typeof item === 'string'
            ? { id: `media-${item}`, url: item, type: 'image' }
            : item
        )
      );
    }
  };

  const handleAddDirectLink = (e) => {
    e?.preventDefault();
    const trimmed = (directUrlInput || '').trim();
    if (!trimmed || isMaxPhotos) return;

    if (onAddPhotoUrl) {
      onAddPhotoUrl(trimmed);
    } else if (onMediaChange) {
      onMediaChange([
        ...photoList.map((item) =>
          typeof item === 'string' ? { id: `media-${item}`, url: item, type: 'image' } : item
        ),
        { id: `media-${trimmed}-${Date.now()}`, url: trimmed, type: 'image', isExisting: true },
      ]);
    }
    setDirectUrlInput('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          const remaining = Math.max(0, maxPhotos - photoList.length);
          files.slice(0, remaining).forEach((f) => onAddPhoto?.(f));
          e.target.value = '';
        }}
        accept="image/*"
        multiple
        disabled={disabled || isMaxPhotos || pendingUploads > 0}
        className="hidden"
        id={`${idPrefix}-file-input`}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Product Photos ({photoList.length}/{maxPhotos}) <span className="text-red-500">*</span>
          </label>
          {isMaxPhotos ? (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Max {maxPhotos} Reached
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">
              {maxPhotos - photoList.length} slot{maxPhotos - photoList.length === 1 ? '' : 's'} remaining
            </span>
          )}
        </div>
        {!isMaxPhotos && !disabled && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={pendingUploads > 0}
            className="text-xs font-bold text-brand-blue hover:underline cursor-pointer disabled:opacity-50"
          >
            + Browse Files
          </button>
        )}
      </div>

      {/* Direct Image Link Input Bar */}
      {!disabled && (
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-link text-xs" />
            </div>
            <input
              type="url"
              value={directUrlInput}
              disabled={isMaxPhotos || pendingUploads > 0}
              onChange={(e) => setDirectUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDirectLink();
                }
              }}
              placeholder={
                isMaxPhotos
                  ? `Maximum ${maxPhotos} images reached`
                  : 'Paste direct image URL (bypasses Firebase storage directly to DB)'
              }
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            disabled={isMaxPhotos || !directUrlInput.trim() || pendingUploads > 0}
            onClick={handleAddDirectLink}
            className="w-full sm:w-auto px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            <span>Add Link</span>
          </button>
        </div>
      )}

      {/* Main Dropzone or Grid */}
      {photoList.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setPhotoDragOver(true);
          }}
          onDragLeave={() => setPhotoDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setPhotoDragOver(false);
            if (disabled) return;
            const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
            files.slice(0, maxPhotos).forEach((f) => onAddPhoto?.(f));
          }}
          onClick={() => {
            if (!disabled && pendingUploads === 0) fileInputRef.current?.click();
          }}
          className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all ${
            disabled
              ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
              : photoDragOver
              ? 'border-brand-blue bg-blue-50 cursor-pointer'
              : 'border-slate-200 hover:border-blue-300 bg-slate-50/50 cursor-pointer'
          }`}
        >
          <i className="fa-solid fa-cloud-arrow-up text-3xl text-brand-blue mb-2" />
          <p className="text-sm font-bold text-slate-700">Click to upload files or drag &amp; drop photos here</p>
          <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (or paste direct image link above) · Max {maxPhotos} images</p>
        </div>
      ) : (
        <div className="space-y-2">
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled || disabled) return;
              const { source } = event.operation;
              if (isSortable(source)) {
                const { initialIndex, index } = source;
                if (initialIndex !== undefined && index !== undefined && initialIndex !== index) {
                  handleMove(initialIndex, index);
                }
              }
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {photoList.map((item, idx) => {
                const keyId = typeof item === 'string'
                  ? item
                  : item instanceof File
                  ? `${item.name}-${item.size}-${idx}`
                  : item?.url || item?.id || `photo-${idx}`;

                return (
                  <DndSortablePhotoItem
                    key={keyId}
                    id={keyId}
                    idx={idx}
                    item={item}
                    isFirst={idx === 0}
                    photosLength={photoList.length}
                    onRemovePhoto={handleRemove}
                    onMovePhoto={handleMove}
                    disabled={disabled}
                  />
                );
              })}
              {!isMaxPhotos && !disabled && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={pendingUploads > 0}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-blue flex flex-col items-center justify-center text-slate-400 hover:text-brand-blue transition-colors cursor-pointer bg-slate-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-plus text-base mb-1" />
                  <span className="text-[11px] font-bold">Add Photo</span>
                  <span className="text-[9px] text-slate-400">File or Link</span>
                </button>
              )}
            </div>
          </DragDropProvider>
          <p className="text-[11px] text-slate-400">
            <i className="fa-solid fa-circle-info mr-1" />
            Drag to reorder or use arrows. <strong>Position #1</strong> automatically serves as the primary cover photo.
          </p>
        </div>
      )}

      {pendingUploads > 0 && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
          <i className="fa-solid fa-spinner fa-spin text-brand-blue" />
          Uploading {pendingUploads} media item{pendingUploads > 1 ? 's' : ''}...
        </div>
      )}
    </div>
  );
}