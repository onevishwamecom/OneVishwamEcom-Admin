import { formatDate } from '../../../../utils';
import { StatusBadge } from '../../../../components/Admin/AdminUi';
import { typeIcon } from '../constants';

export default function ItemsTable({ items }) {
  return (
    <div className="overflow-x-auto -m-5">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50">
            <th className="px-2.5 sm:px-3 py-2 font-semibold">Item</th>
            <th className="px-2.5 sm:px-3 py-2 font-semibold w-px whitespace-nowrap">Category</th>
            <th className="px-2.5 sm:px-3 py-2 font-semibold">City</th>
            <th className="px-2.5 sm:px-3 py-2 font-semibold whitespace-nowrap">Date</th>
            <th className="px-2.5 sm:px-3 py-2 font-semibold text-right w-px whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id || item.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
              <td className="px-2.5 sm:px-3 py-2 font-semibold text-slate-800 max-w-[200px] truncate">{item.title || item.name}</td>
              <td className="px-2.5 sm:px-3 py-2 text-slate-600 capitalize inline-flex items-center gap-1.5 w-px whitespace-nowrap">
                <i className={`fa-solid ${typeIcon(item._type)} text-slate-300 text-xs`} aria-hidden="true" />
                {item._type || item.category}
              </td>
              <td className="px-2.5 sm:px-3 py-2 text-slate-600 max-w-[120px] truncate">{item.city || '—'}</td>
              <td className="px-2.5 sm:px-3 py-2 text-slate-500 whitespace-nowrap text-xs">{formatDate(item.createdAt)}</td>
              <td className="px-2.5 sm:px-3 py-2 text-right w-px whitespace-nowrap">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}