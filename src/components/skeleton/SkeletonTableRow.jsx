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
    <tr className={`border-b border-slate-100 transition-colors ${even ? 'bg-slate-50/40' : 'bg-white'}`}>
      {checkbox && (
        <td className="px-2 py-1.5 w-8">
          <Skeleton className="h-3.5 w-3.5" rounded="rounded" />
        </td>
      )}
      {showIndex && (
        <td className="px-1.5 py-1.5 text-center w-7">
          <Skeleton className="h-3 w-3.5 mx-auto" rounded="rounded" />
        </td>
      )}
      {Array.from({ length: columns }).map((_, ci) => {
        // Product column: title
        if (ci === 0) {
          return (
            <td key={ci} className="px-2 py-1.5">
              <div className="flex items-center gap-2 min-w-[120px] max-w-[170px]">
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-3 w-4/5" rounded="rounded" />
                  <Skeleton className="h-2 w-1/2" rounded="rounded" />
                </div>
              </div>
            </td>
          );
        }

        // Category column: icon badge + label
        if (ci === 1) {
          return (
            <td key={ci} className="px-2 py-1.5">
              <div className="flex items-center gap-1">
                <Skeleton className="w-5 h-5 rounded shrink-0" />
                <Skeleton className="h-3 w-14" rounded="rounded" />
              </div>
            </td>
          );
        }

        // Location column: pin + text
        if (ci === 2) {
          return (
            <td key={ci} className="px-2 py-1.5">
              <Skeleton className="h-3 w-16" rounded="rounded" />
            </td>
          );
        }

        // Date column: clock + date
        if (ci === 3) {
          return (
            <td key={ci} className="px-2 py-1.5">
              <Skeleton className="h-3 w-14" rounded="rounded" />
            </td>
          );
        }

        // Status column: pill
        if (ci === 4) {
          return (
            <td key={ci} className="px-2 py-1.5">
              <Skeleton className="h-4.5 w-14 rounded-full" />
            </td>
          );
        }

        // Generic fallback for any additional columns
        return (
          <td key={ci} className="px-2 py-1.5">
            <Skeleton className="h-3 w-12" rounded="rounded" />
          </td>
        );
      })}
      {action && (
        <td className="px-2 py-1.5 text-right w-10">
          <Skeleton className="h-6 w-6 rounded-md ml-auto shrink-0" />
        </td>
      )}
    </tr>
  );
}

export default SkeletonTableRow;
