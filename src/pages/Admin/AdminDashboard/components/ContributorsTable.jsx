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
        <Link
          key="name"
          to={`/admin/contributors/${encodeURIComponent(c.id || c._id)}`}
          className="font-medium text-slate-800 hover:text-brand-blue transition-colors"
        >
          {c.name}
        </Link>,
        <span key="contact" className="text-slate-600">
          {c.contact || '—'}
        </span>,
        <span key="total" className="font-extrabold text-slate-900">
          {c.totalListings}
        </span>,
        <span key="pending" className="font-semibold text-amber-700">
          {c.pendingListings}
        </span>,
        <span key="approved" className="font-semibold text-emerald-600">
          {c.approvedListings}
        </span>,
        <span key="cancelled" className="font-semibold text-rose-500">
          {c.cancelledListings}
        </span>,
      ]}
      className="border-0 shadow-none -m-5 rounded-none"
    />
  );
}