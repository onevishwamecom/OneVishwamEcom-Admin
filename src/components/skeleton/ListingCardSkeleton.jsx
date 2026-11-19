import Skeleton from './Skeleton';

/**
 * ListingCardSkeleton — mirrors the compact ListingCard:
 * 16:9 image aspect ratio, top badges & action buttons,
 * category pill + date, title, location, spec pills,
 * and full-width single-line action button.
 */
export function ListingCardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col h-full ${className}`}>
      {/* ── Image Container (Compact 16:9) ── */}
      <div className="relative aspect-[16/9] bg-slate-100 shrink-0">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Top-Left Badges */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 z-10">
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>

        {/* Top-Right Action Buttons */}
        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 gap-1.5">
        {/* Category Pill & Date */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4.5 w-16 rounded-md" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>

        {/* Title */}
        <Skeleton className="h-4 w-4/5 rounded-md mt-0.5" />

        {/* Location */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full shrink-0" />
          <Skeleton className="h-3 w-3/5 rounded" />
        </div>

        {/* Specification Tags */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <Skeleton className="h-5 w-18 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        {/* Card Footer: Full-Width 1-Line Action Button */}
        <div className="mt-auto pt-2.5 border-t border-slate-100">
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ListingCardSkeleton;
