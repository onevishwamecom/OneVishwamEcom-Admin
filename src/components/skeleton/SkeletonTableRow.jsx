import Skeleton from './Skeleton';

/**
 * A single skeleton table row. Renders a serial-number cell plus `columns`
 * cells. The last cell (action/status) can be given a pill/button shape.
 * Matches the real DataTable row height (~72px, py-3.5).
 */
export function SkeletonTableRow({
  columns = 4,
  checkbox = false,
  action = false,
  even = false,
}) {
  return (
    <tr className={`border-b border-slate-100 ${even ? 'bg-slate-50/60' : 'bg-white'}`}>
      {checkbox && (
        <td className="px-4 py-3.5 w-10">
          <Skeleton className="h-4 w-4 rounded" rounded="rounded" />
        </td>
      )}
      <td className="px-4 py-3.5 text-center w-12">
        <Skeleton className="h-3 w-4 mx-auto" rounded="rounded" />
      </td>
      {Array.from({ length: columns }).map((_, ci) => (
        <td key={ci} className="px-5 py-3.5">
          <Skeleton
            className={`h-3.5 ${ci === 0 ? 'w-3/4' : 'w-1/2'}`}
            rounded="rounded"
          />
        </td>
      ))}
      {action && (
        <td className="px-5 py-3.5 text-right">
          <Skeleton className="h-7 w-16 ml-auto" rounded="rounded-md" />
        </td>
      )}
    </tr>
  );
}

export default SkeletonTableRow;