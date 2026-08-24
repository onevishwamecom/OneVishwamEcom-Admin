import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR, formatDate } from '../../../../utils';
import { StatusBadge, DataTable } from '../../../../components/Admin/AdminUi';

const COLUMNS = [
  { key: 'listing',     label: 'Listing' },
  { key: 'contributor', label: 'Contributor' },
  { key: 'category',    label: 'Category' },
  { key: 'location',    label: 'Location' },
  { key: 'price',       label: 'Price' },
  { key: 'submitted',   label: 'Submitted' },
  { key: 'status',      label: 'Status',    className: 'w-px whitespace-nowrap' },
];

function renderListingRow(l, contributorName, category, isUnseen, onOpenListing) {
  const unseen = isUnseen(l._id || l.id);
  const title = l.title || l.name || l.brand || 'Untitled';
  return [
    /* Listing title + inline view link */
    <td key="listing">
      <Link
        to={`/admin/listings/${l._type}/${l._id}`}
        onClick={() => onOpenListing?.(l)}
        className={`group/link font-medium hover:text-brand-blue transition-colors ${
          unseen ? 'text-brand-blue font-semibold' : 'text-slate-800'
        }`}
        title={title}
      >
        {unseen && (
          <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            <i className="fa-solid fa-circle text-[6px]" aria-hidden="true" />
            New
          </span>
        )}
        <span className="block">
          {title.length > 40 ? `${title.substring(0, 40)}…` : title}
        </span>
        <span className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] font-normal text-slate-400">{l._id}</span>
           
        </span>
      </Link>
    </td>,

    /* Contributor */
    <td key="contributor" className="font-medium text-slate-600">
      {contributorName || '—'}
    </td>,

    /* Category */
    <td key="category">
      <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold capitalize text-slate-600">
        {category?.label || l._type}
      </span>
    </td>,

    /* Location */
    <td key="location" className="text-slate-600 whitespace-nowrap">
      {l.location || l.area || l.city || '—'}
    </td>,

    /* Price */
    <td key="price" className="font-bold whitespace-nowrap">
      {formatINR(l.price, { compact: true }) || '—'}
    </td>,

    /* Submitted */
    <td key="submitted" className="text-slate-500 whitespace-nowrap">
      {formatDate(l.createdAt)}
    </td>,

    /* Status */
    <td key="status">
      <StatusBadge status={l.status} />
    </td>,
  ];
}

export default function ListingsTable({
  listings,
  contributorNameById,
  categoryById,
  isUnseen = () => false,
  onOpenListing,
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const searchLower = searchQuery.toLowerCase();
  const filtered = listings.filter(
    (l) => {
      const title = (l.title || l.name || l.brand || '').toLowerCase();
      const contributor = (contributorNameById[l.contributorId] || l.lister?.name || '').toLowerCase();
      const catLabel = (categoryById[l._type]?.label || l._type || '').toLowerCase();
      const location = (l.location || l.area || l.city || '').toLowerCase();
      return title.includes(searchLower) ||
        contributor.includes(searchLower) ||
        catLabel.includes(searchLower) ||
        location.includes(searchLower);
    },
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const effectivePage = page > totalPages ? totalPages : page;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      {/* Search / filter bar */}
      <div className="p-3 border-b border-slate-100/60">
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search listings…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[160px] rounded-md border border-slate-200 py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-150"
          />
          <select className="rounded-md border border-slate-200 py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
            <option value="">Category</option>
            <option value="properties">Real Estate</option>
            <option value="vehicles">Vehicles</option>
            <option value="groceries">Groceries</option>
            <option value="garments">Garments</option>
            <option value="jewellery">Jewellery</option>
            <option value="finance">Finance</option>
            <option value="services">Services</option>
          </select>
          {/* <select className="rounded-md border border-slate-200 py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
            <option value="">Contributor</option>
            <option value="all">All Contributors</option>
          </select>
          <select className="rounded-md border border-slate-200 py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
            <option value="">Location</option>
            <option value="all">All Locations</option>
          </select> */}
          <button
            type="button"
            className="rounded-md bg-brand-blue text-white py-1.5 px-3 text-sm font-medium hover:bg-brand-blue/90 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        rows={filtered}
        page={effectivePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        renderRow={(l) =>
          renderListingRow(
            l,
            contributorNameById[l.contributorId],
            categoryById[l._type] || {},
            isUnseen,
            onOpenListing,
          )
        }
        getRowClassName={(l) =>
          isUnseen(l._id || l.id)
            ? 'bg-brand-blue/[0.06] border-l-4 border-l-brand-blue'
            : ''
        }
        emptyIcon="fa-inbox"
        emptyTitle="No listings found"
        emptyMessage={
          searchQuery
            ? 'No listings match your search criteria.'
            : 'No listings found for the current filter.'
        }
        className="rounded-none border-0 shadow-none"
      />

      {/* Pagination info already shown inside DataTable */}
    </div>
  );
}
