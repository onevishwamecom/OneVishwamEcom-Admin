import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import client from '../../api/client';

const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

function SortableMediaItem({
  id,
  media,
  index,
  isFirst,
  onRemove,
  onMakePrimary,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const isVideo = media.type === 'video';
  const isPreview = media.preview !== undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group touch-none"
    >
      <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 cursor-grab active:cursor-grabbing relative touch-none">
        {isVideo ? (
          <>
            <video
              src={media.url || media.preview}
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
              muted
              playsInline
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <i className="fa-solid fa-play text-3xl text-white" />
            </div>
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none">
              VIDEO
            </span>
          </>
        ) : (
          <img
            src={media.url || media.preview}
            alt={`media-${index}`}
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {isFirst && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
            <i className="fa-solid fa-star text-[8px]" />
            Main
          </span>
        )}
        {isPreview && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
            Preview
          </span>
        )}
      </div>

      <div className="absolute top-1 right-1 flex gap-1 pointer-events-none">
        {!isFirst && (
          <button
            type="button"
            onClick={onMakePrimary}
            className="w-7 h-7 rounded-full bg-white/90 text-slate-600 hover:bg-yellow-400 hover:text-white shadow-md flex items-center justify-center transition-all text-[11px]"
            aria-label="Make primary"
          >
            <i className="fa-solid fa-arrow-up" />
          </button>
        )}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove(id);
          }}
          className="w-7 h-7 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:bg-red-600 transition-all text-[11px] cursor-pointer active:scale-95"
          aria-label="Remove media"
        >
          <i className="fa-solid fa-trash" />
        </button>
      </div>

      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 z-10 touch-none"
        aria-label={`Drag to reorder ${isVideo ? 'video' : 'image'} ${index + 1}`}
      />
    </div>
  );
}

function SortableMediaOverlay({ media, index, isFirst, isVideo }) {
  const style = {
    transform: CSS.Transform.toString(media.transform),
    transition: media.transition,
    zIndex: 50,
  };

  return (
    <div
      style={style}
      className="relative touch-none"
    >
      <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border-2 border-brand-blue/50 shadow-xl opacity-80 touch-none">
        {isVideo ? (
          <>
            <video
              src={media.url || media.preview}
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <i className="fa-solid fa-play text-3xl text-white" />
            </div>
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none">
              VIDEO
            </span>
          </>
        ) : (
          <img
            src={media.url || media.preview}
            alt={`media-${index}`}
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
        )}
        {isFirst && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
            <i className="fa-solid fa-star text-[8px]" />
            Main
          </span>
        )}
      </div>
    </div>
  );
}

export default function SortableMediaList({
  media = [],
  onMediaChange,
  onUploadProgress,
  maxMedia = 6,
  accept = 'image/*,video/*',
  disabled = false,
  showMainBadge = true,
  className = '',
}) {
  const [items, setItems] = useState(() => media.map((m, i) => ({
    id: m.id || `media-${i}-${Date.now()}`,
    type: m.type || (m.url?.startsWith('video') || m.preview?.startsWith('blob:video') ? 'video' : 'image'),
    url: m.url,
    preview: m.preview,
    file: m.file,
    isExisting: !!m.url && !m.preview,
  })));
  const [uploading, setUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((_event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((currentItems) => {
      const oldIndex = currentItems.findIndex((item) => item.id === active.id);
      const newIndex = currentItems.findIndex((item) => item.id === over.id);
      return arrayMove(currentItems, oldIndex, newIndex);
    });
  }, []);

  const handleDragStart = useCallback((_event) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  const uploadMedia = useCallback(async (file) => {
    const isVideo = file.type.startsWith('video/');
    
    if (isVideo) {
      if (file.size > MAX_VIDEO_SIZE) {
        throw new Error('Video must be less than 10 MB');
      }
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        throw new Error('Unsupported video format. Use MP4, WebM, or MOV');
      }
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Unsupported image format. Use JPEG, PNG, WebP, GIF, or AVIF');
      }
    }

    const fileId = `${file.name}-${Date.now()}`;
    setPendingUploads((prev) => prev + 1);
    setUploading(true);

    const previewUrl = URL.createObjectURL(file);
    const tempId = `temp-${fileId}`;
    
    setItems((prev) => [...prev, {
      id: tempId,
      type: isVideo ? 'video' : 'image',
      preview: previewUrl,
      file,
      isUploading: true,
    }]);

    if (onUploadProgress) onUploadProgress(fileId, 0);

    const formData = new FormData();
    const fieldName = isVideo ? 'video' : 'images';
    formData.append(fieldName, file);

    try {
      const response = await client.post(`/upload/${isVideo ? 'video' : 'images'}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            onUploadProgress(fileId, progress);
          }
        },
      });

      const backendResponse = response.data;
      const urls = backendResponse?.data?.[isVideo ? 'videos' : 'images'] || backendResponse?.[isVideo ? 'videos' : 'images'] || [];

      if (urls.length > 0) {
        setItems((prev) => prev.map((item) =>
          item.id === tempId
            ? { ...item, id: urls[0], url: urls[0], preview: undefined, file: undefined, isUploading: false, isExisting: true }
            : item
        ));
      } else {
        throw new Error('No URL in upload response');
      }
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      URL.revokeObjectURL(previewUrl);
      throw err;
    } finally {
      setPendingUploads((prev) => Math.max(0, prev - 1));
      setUploading(false);
    }
  }, [onUploadProgress]);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';

    if (files.length === 0) return;

    const currentCount = items.length;
    const availableSlots = maxMedia - currentCount;
    
    if (availableSlots <= 0) {
      setErrors({ general: `Maximum ${maxMedia} media items allowed` });
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    setErrors({});

    for (const file of filesToUpload) {
      try {
        await uploadMedia(file);
      } catch (err) {
        setErrors((prev) => ({ ...prev, [file.name]: err.message }));
      }
    }
  }, [items.length, maxMedia, uploadMedia]);

  const handleRemove = useCallback((id) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.preview && !item.url) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleMakePrimary = useCallback((id) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index <= 0) return prev;
      const newItems = [...prev];
      const [moved] = newItems.splice(index, 1);
      newItems.unshift(moved);
      return newItems;
    });
  }, []);

  useEffect(() => {
    const finalMedia = items.map((item) => ({
      id: item.id,
      type: item.type,
      url: item.url,
    }));
    onMediaChange(finalMedia);
  }, [items, onMediaChange]);

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.preview && !item.url) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [items]);

  if (items.length === 0 && disabled) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          Media ({items.length}/{maxMedia})
          {items.length > 0 && (
            <span className="ml-2 text-xs text-slate-500">
              {showMainBadge && items[0] && (
                <span className="inline-flex items-center gap-1 text-yellow-600">
                  <i className="fa-solid fa-star text-[9px]" />
                  First is Main
                </span>
              )}
            </span>
          )}
        </label>
        {items.length < maxMedia && !disabled && (
          <label htmlFor="media-upload" className="cursor-pointer">
            <button
              type="button"
              disabled={uploading || items.length >= maxMedia}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-navy transition-colors disabled:opacity-50"
            >
              <i className="fa-solid fa-plus text-[10px]" />
              Add Media
            </button>
          </label>
        )}
      </div>

      {errors.general && (
        <p className="mb-3 text-xs text-red-500 flex items-center gap-1">
          <i className="fa-solid fa-triangle-exclamation" /> {errors.general}
        </p>
      )}

      <input
        id="media-upload"
        type="file"
        ref={fileInputRef}
        accept={accept}
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading || items.length >= maxMedia}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item, index) => (
              <SortableMediaItem
                key={item.id}
                id={item.id}
                media={item}
                index={index}
                isFirst={index === 0}
                onRemove={() => handleRemove(item.id)}
                onMakePrimary={() => handleMakePrimary(item.id)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {({ active }) => {
            const item = items.find((i) => i.id === active.id);
            if (!item) return null;
            return (
              <SortableMediaOverlay
                media={item}
                index={items.findIndex((i) => i.id === active.id)}
                isFirst={items[0]?.id === active.id}
                isVideo={item.type === 'video'}
              />
            );
          }}
        </DragOverlay>
      </DndContext>

      {pendingUploads > 0 && (
        <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
          <i className="fa-solid fa-spinner fa-spin text-brand-blue" />
          Uploading {pendingUploads} media item{pendingUploads > 1 ? 's' : ''}...
        </div>
      )}
    </div>
  );
}