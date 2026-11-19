import Skeleton from './Skeleton';

/**
 * A single skeleton table row matching the compact ListingTable layout (py-2, px-3.5).
 * Column 0: Product thumbnail + title
 * Column 1: Category icon badge + label
 * Column 2: Location icon + text
 * Column 3: Date icon + text
 * Column 4: Status pill
 * Action: Two compact icon buttons (Edit + Delete)
 */
export function SkeletonTableRow({
  columns = 5,
  checkbox = false,
  showIndex = false,
  action = false,
  even = false,
}) {
  return (
    <tr className={`border-b border-slate-100 transition-colors ${even ? 'bg-slate-50/30' : 'bg-white'}`}>
      {checkbox && (
        <td className="px-3.5 py-2 w-10">
          <Skeleton className="h-4 w-4" rounded="rounded" />
        </td>
      )}
      {showIndex && (
        <td className="px-3.5 py-2 text-center w-12">
          <Skeleton className="h-3 w-4 mx-auto" rounded="rounded" />
        </td>
      )}
      {Array.from({ length: columns }).map((_, ci) => {
        // Product column: thumbnail + title
        if (ci === 0) {
          return (
            <td key={ci} className="px-3.5 py-2">
              <div className="flex items-center gap-2.5 min-w-[180px] max-w-[260px]">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-3 w-3/4" rounded="rounded" />
                  <Skeleton className="h-2 w-1/2" rounded="rounded" />
                </div>
              </div>
            </td>
          );
        }

        // Category column: icon badge + label
        if (ci === 1) {
          return (
            <td key={ci} className="px-3.5 py-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-md shrink-0" />
                <Skeleton className="h-3 w-16" rounded="rounded" />
              </div>
            </td>
          );
        }

        // Location column: pin + text
        if (ci === 2) {
          return (
            <td key={ci} className="px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                <Skeleton className="h-3 w-24" rounded="rounded" />
              </div>
            </td>
          );
        }

        // Date column: clock + date
        if (ci === 3) {
          return (
            <td key={ci} className="px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                <Skeleton className="h-3 w-20" rounded="rounded" />
              </div>
            </td>
          );
        }

        // Status column: pill
        if (ci === 4) {
          return (
            <td key={ci} className="px-3.5 py-2">
              <Skeleton className="h-5 w-18 rounded-full" />
            </td>
          );
        }

        // Generic fallback for any additional columns
        return (
          <td key={ci} className="px-3.5 py-2">
            <Skeleton className="h-3 w-1/2" rounded="rounded" />
          </td>
        );
      })}
      {action && (
        <td className="px-3.5 py-2 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          </div>
        </td>
      )}
    </tr>
  );
}

export default SkeletonTableRow;
