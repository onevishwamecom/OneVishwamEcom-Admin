export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-xl shimmer ${className}`}
      aria-hidden="true"
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-7 w-16 mb-1" />
      <Skeleton className="h-2.5 w-20" />
    </div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card">
      <div className="flex">
        <Skeleton className="w-32 h-32 rounded-none" />
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
