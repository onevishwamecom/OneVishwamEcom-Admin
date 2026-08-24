import { Link } from 'react-router-dom';
import { DataTable } from '../../../../components/Admin/AdminUi';

const COLUMNS = [
  { key: 'name', label: 'Contributor' },
  { key: 'contact', label: 'Contact' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'pending', label: 'Pending', align: 'right' },
  { key: 'approved', label: 'Approved', align: 'right' },
  { key: 'cancelled', label: 'Cancelled', align: 'right' },
];

export default function ContributorsTable({ contributors = [] }) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={contributors}
      emptyIcon="fa-users"
      emptyTitle="No contributors yet"
      emptyMessage="Contributors who list items will appear here."
      renderRow={(c) => [
        <td key="name" className="font-medium text-slate-800">
          <Link
            to={`/admin/contributors/${encodeURIComponent(c.id || c._id)}`}
            className="hover:text-brand-blue transition-colors"
          >
            {c.name}
          </Link>
        </td>,
        <td key="contact" className="text-slate-600">
          {c.contact || '—'}
        </td>,
        <td key="total" className="text-right font-extrabold text-slate-900">
          {c.totalListings}
        </td>,
        <td key="pending" className="text-right font-semibold text-amber-700">
          {c.pendingListings}
        </td>,
        <td key="approved" className="text-right font-semibold text-emerald-600">
          {c.approvedListings}
        </td>,
        <td key="cancelled" className="text-right font-semibold text-rose-500">
          {c.cancelledListings}
        </td>,
      ]}
      className="border-0 shadow-none -m-5 rounded-none"
    />
  );
}