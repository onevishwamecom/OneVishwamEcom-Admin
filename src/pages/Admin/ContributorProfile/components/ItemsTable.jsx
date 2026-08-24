import { formatDate } from '../../../../utils';
import { StatusBadge } from '../../../../components/Admin/AdminUi';
import { typeIcon } from '../constants';

export default function ItemsTable({ items }) {
  return (
    <div className="overflow-x-auto -m-5">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
            <th className="px-5 py-3 font-bold">Item</th>
            <th className="px-5 py-3 font-bold">Category</th>
            <th className="px-5 py-3 font-bold">City</th>
            <th className="px-5 py-3 font-bold">Date</th>
            <th className="px-5 py-3 font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id || item.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
              <td className="px-5 py-3.5 font-bold text-slate-800 max-w-xs truncate">{item.title || item.name}</td>
              <td className="px-5 py-3.5 text-slate-600 capitalize inline-flex items-center gap-2">
                <i className={`fa-solid ${typeIcon(item._type)} text-slate-300 text-xs`} aria-hidden="true" />
                {item._type || item.category}
              </td>
              <td className="px-5 py-3.5 text-slate-600">{item.city || '—'}</td>
              <td className="px-5 py-3.5 text-slate-600">{formatDate(item.createdAt)}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}