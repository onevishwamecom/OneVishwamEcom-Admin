import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { getDisplayId, formatDate, formatINR } from '../../utils';
import Button from './Button';
import IconButton from './IconButton';
import StatusPill from './StatusPill';
import CategoryBadge from './CategoryBadge';

// Standard category visual configuration
export const DEFAULT_CATEGORY_CONFIG = {
  properties: { label: 'Properties', icon: 'fa-house-chimney', color: 'bg-blue-50 text-brand-blue border-blue-100' },
  property: { label: 'Properties', icon: 'fa-house-chimney', color: 'bg-blue-50 text-brand-blue border-blue-100' },
  vehicle: { label: 'Vehicle', icon: 'fa-car-side', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  vehicles: { label: 'Vehicles', icon: 'fa-car-side', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  grocery: { label: 'Grocery', icon: 'fa-basket-shopping', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  groceries: { label: 'Groceries', icon: 'fa-basket-shopping', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  garment: { label: 'Garments', icon: 'fa-shirt', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  garments: { label: 'Garments', icon: 'fa-shirt', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  jewellery: { label: 'Jewellery', icon: 'fa-gem', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  finance: { label: 'Finance', icon: 'fa-building-columns', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  services: { label: 'Services', icon: 'fa-wrench', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

// Standard status pill configuration
export const DEFAULT_STATUS_CONFIG = {
  pending: {
    label: 'Pending Approval',
    icon: 'fa-regular fa-clock',
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  approved: {
    label: 'Approved',
    icon: 'fa-regular fa-circle-check',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  },
  'changes-required': {
    label: 'Changes Required',
    icon: 'fa-regular fa-pen-to-square',
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'fa-regular fa-circle-xmark',
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  rejected: {
    label: 'Rejected',
    icon: 'fa-regular fa-circle-xmark',
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
};

/**
 * Reusable ListingTable component matching screenshot design.
 * Configurable via props for use across Lister and Admin portals.
 */
function ListingTable({
  items = [],
  columns = ['product', 'category', 'location', 'date', 'status', 'actions'],
  getItemLink,
  getEditLink,
  onEdit,
  onDelete,
  busyId,
  portal = 'admin', // 'lister' | 'admin'
  categoryConfigMap = DEFAULT_CATEGORY_CONFIG,
  statusConfigMap = DEFAULT_STATUS_CONFIG,
  customRenderers = {},
  renderCustomActions,
  responsiveMode = 'cards', // 'cards' | 'scroll'
  emptyState = null,
  className = '',
  tableClassName = '',
  pagination = null,
  currentPage = 1,
  perPage = 10,
}) {
  if (!items || items.length === 0) {
    return emptyState || (
      <div className="p-8 text-center bg-slate-50/40 rounded-xl">
        <p className="text-xs text-slate-500">No items available.</p>
      </div>
    );
  }

  // Helper to resolve detail URL
  const resolveDetailUrl = (item) => {
    if (typeof getItemLink === 'function') return getItemLink(item);
    const targetId = item.itemId || item._id || item.id;
    const cat = item._type || item.category || 'properties';
    if (portal === 'admin') {
      return targetId ? `/admin/listings/${encodeURIComponent(cat)}/${encodeURIComponent(targetId)}` : '#';
    }
    return targetId ? `/listings/${encodeURIComponent(targetId)}?type=${encodeURIComponent(cat)}` : '#';
  };

  // Helper to resolve edit URL
  const resolveEditUrl = (item) => {
    if (typeof getEditLink === 'function') return getEditLink(item);
    const targetId = item._id || item.id || item.itemId;
    const cat = item._type || item.category || 'properties';
    if (portal === 'admin') {
      return targetId ? `/admin/listings/${encodeURIComponent(cat)}/${encodeURIComponent(targetId)}` : '#';
    }
    return targetId ? `/add-listing?edit=${encodeURIComponent(targetId)}&type=${encodeURIComponent(cat)}` : '#';
  };

  // Built-in column renderers matching screenshot
  const defaultRenderers = {
    index: (item, idx) => (
      <span className="font-mono text-slate-400 text-xs">
        {(currentPage - 1) * perPage + idx + 1}
      </span>
    ),

    product: (item) => {
      const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.image ? [item.image] : [];
      const img = images[0];
      const title = item.title || item.name || item.brand || 'Untitled Product';
      const detailUrl = resolveDetailUrl(item);
      const isCancelled = item.status === 'cancelled' || item.status === 'rejected';
      const isChangesReq = item.status === 'changes-required';
      const reason = item.adminComment || item.adminFeedback || item.reason;
      const displayId = item.itemId || item._id || item.id;

      return (
        <div className="flex items-center gap-3 min-w-[200px] max-w-[280px]">
          {img ? (
            <Link to={detailUrl} className="shrink-0 group/thumb block overflow-hidden rounded-xl">
              <img
                src={img}
                alt=""
                className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 shrink-0 bg-slate-100 group-hover/thumb:border-brand-blue group-hover/thumb:scale-105 transition-all"
              />
            </Link>
          ) : (
            <Link to={detailUrl} className="shrink-0 group/thumb block rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-400 flex items-center justify-center shrink-0 group-hover/thumb:border-brand-blue group-hover/thumb:text-brand-blue transition-colors">
                <i className="fa-solid fa-image text-xs" />
              </div>
            </Link>
          )}

          <div className="min-w-0 flex-1">
            <Link
              to={detailUrl}
              className="font-bold text-slate-900 text-xs hover:text-brand-blue hover:underline truncate block transition-colors"
              title={title}
            >
              {title}
            </Link>
            {item.itemId && (
              <p className="text-[10px] text-slate-400 font-mono">
                ID: {String(displayId || '').slice(-6).toUpperCase()}
              </p>
            )}
            {isCancelled && reason && (
              <p className="text-[11px] font-medium text-rose-600 truncate mt-0.5 flex items-center gap-1">
                <i className="fa-solid fa-circle-exclamation text-[10px]" />
                Reason: {reason}
              </p>
            )}
            {isChangesReq && reason && (
              <p className="text-[11px] font-medium text-amber-600 truncate mt-0.5 flex items-center gap-1">
                <i className="fa-solid fa-pen-to-square text-[10px]" />
                Reason: {reason}
              </p>
            )}
          </div>
        </div>
      );
    },

    category: (item) => (
      <CategoryBadge
        category={item._type || item.category}
        cfgMap={categoryConfigMap}
      />
    ),

    subcategory: (item) => (
      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold whitespace-nowrap">
        {item.subcategory || 'General'}
      </span>
    ),

    location: (item) => {
      const loc = [item.area, item.city].filter(Boolean).join(', ') || item.location || item.city || item.area || '—';
      return (
        <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
          <i className="fa-solid fa-location-dot text-slate-400 text-[11px] shrink-0" />
          <span className="text-xs font-medium truncate max-w-[150px]">{loc}</span>
        </div>
      );
    },

    date: (item) => (
      <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
        <i className="fa-regular fa-clock text-slate-400 text-[11px] shrink-0" />
        <span className="text-xs font-medium">{formatDate(item.createdAt || item.date)}</span>
      </div>
    ),

    price: (item) => (
      <span className="font-bold text-slate-900 text-xs whitespace-nowrap">
        {formatINR(item.numericPrice || item.priceValue || item.price)}
      </span>
    ),

    multimedia: (item) => {
      const imgCount = Array.isArray(item.images) ? item.images.filter(Boolean).length : item.image ? 1 : 0;
      const hasVideo = Boolean(item.video || item.videoUrl);
      const hasPdf = Boolean(item.pdfUrl || item.brochure);

      return (
        <div className="flex items-center gap-1.5 flex-wrap max-w-[220px]">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
              imgCount > 0 ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title={`${imgCount} of 5 images attached`}
          >
            <i className="fa-solid fa-camera text-[10px]" />
            <span>{imgCount}/5</span>
          </span>
          {hasVideo && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <i className="fa-solid fa-video text-[9px]" /> Video
            </span>
          )}
          {hasPdf && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <i className="fa-solid fa-file-pdf text-[9px]" /> PDF
            </span>
          )}
        </div>
      );
    },

    status: (item) => <StatusPill status={item.status} />,

    actions: (item) => {
      const itemId = item._id || item.id || item.itemId;
      const isBusy = busyId === itemId;
      const editUrl = resolveEditUrl(item);

      return (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          {/* Custom actions slot first (e.g. Media button, Approve button) */}
          {renderCustomActions?.(item, isBusy)}

          {/* Edit button or Link */}
          {onEdit ? (
            <Button
              variant="secondary"
              size="sm"
              icon="fa-pen"
              onClick={() => onEdit(item)}
              title="Edit"
            >
              Edit
            </Button>
          ) : getEditLink || portal === 'lister' ? (
            <Button
              variant="secondary"
              size="sm"
              icon="fa-pen"
              to={editUrl}
              title="Edit"
            >
              Edit
            </Button>
          ) : null}

          {/* Delete button */}
          {onDelete && (
            <IconButton
              variant="danger-soft"
              size="icon"
              icon="fa-trash"
              onClick={() => onDelete(item)}
              loading={isBusy}
              disabled={isBusy}
              title="Delete"
              aria-label="Delete"
            />
          )}
        </div>
      );
    },
  };

  // Normalize column definitions
  const normalizedColumns = columns.map((col) => {
    if (typeof col === 'string') {
      const key = col.toLowerCase();
      const labels = {
        index: '#',
        product: 'Product',
        category: 'Category',
        subcategory: 'Subcategory',
        location: 'Location',
        date: 'Date',
        price: 'Price',
        multimedia: 'Multimedia Assets',
        status: 'Status',
        actions: 'Actions',
      };
      return {
        key,
        label: labels[key] || key.toUpperCase(),
        className: key === 'actions' ? 'text-right' : '',
        render: customRenderers[key] || defaultRenderers[key],
      };
    }
    return {
      key: col.key,
      label: col.label,
      className: col.className || '',
      headerClassName: col.headerClassName || '',
      render: customRenderers[col.key] || col.render || defaultRenderers[col.key],
    };
  });

  return (
    <div className={`w-full ${className}`}>
      {/* ── Desktop & Tablet Table ── */}
      <div className={`overflow-x-auto ${responsiveMode === 'cards' ? 'hidden lg:block' : 'block'}`}>
        <table className={`w-full text-left border-collapse ${tableClassName}`}>
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
              {normalizedColumns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 ${col.className || ''} ${col.headerClassName || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {items.map((item, idx) => {
              const rowId = item._id || item.id || item.itemId || idx;
              return (
                <tr key={rowId} className="hover:bg-slate-50/80 transition-colors">
                  {normalizedColumns.map((col) => {
                    const cellRenderer = col.render || defaultRenderers[col.key];
                    return (
                      <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                        {cellRenderer ? cellRenderer(item, idx) : item[col.key] || '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Responsive Cards (when responsiveMode === 'cards') ── */}
      {responsiveMode === 'cards' && (
        <div className="lg:hidden divide-y divide-slate-100">
          {items.map((item, idx) => {
            const rowId = item._id || item.id || item.itemId || idx;
            const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.image ? [item.image] : [];
            const img = images[0];
            const title = item.title || item.name || item.brand || 'Untitled Product';
            const detailUrl = resolveDetailUrl(item);
            const loc = [item.area, item.city].filter(Boolean).join(', ') || item.location || item.city || item.area || '—';
            const typeKey = (item._type || item.category || '').toLowerCase();
            const catCfg = categoryConfigMap[typeKey] || DEFAULT_CATEGORY_CONFIG[typeKey] || {
              label: item._type || item.category || 'General',
              icon: 'fa-box-open',
              color: 'bg-blue-50 text-brand-blue border-blue-100',
            };
            const st = String(item.status || 'pending').toLowerCase();
            const statusCfg = statusConfigMap[st] || DEFAULT_STATUS_CONFIG[st] || DEFAULT_STATUS_CONFIG.pending;

            return (
              <div key={rowId} className="p-4 space-y-3 bg-white hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  {img ? (
                    <Link to={detailUrl} className="shrink-0">
                      <img
                        src={img}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                      />
                    </Link>
                  ) : (
                    <Link to={detailUrl} className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-image text-sm" />
                      </div>
                    </Link>
                  )}

                  <div className="min-w-0 flex-1">
                    <Link
                      to={detailUrl}
                      className="font-bold text-slate-900 text-sm hover:text-brand-blue truncate block"
                    >
                      {title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        <i className={`fa-solid ${catCfg.icon} text-[10px] text-slate-400`} />
                        {catCfg.label}
                      </span>
                      {item.price && (
                        <span className="text-xs font-bold text-slate-900">
                          • {formatINR(item.numericPrice || item.priceValue || item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${statusCfg.className}`}
                  >
                    <i className={`${statusCfg.icon} text-[9px]`} />
                    <span>{statusCfg.label}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 truncate">
                    <i className="fa-solid fa-location-dot text-slate-400" />
                    <span className="truncate">{loc}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <i className="fa-regular fa-clock text-slate-400" />
                    <span>{formatDate(item.createdAt || item.date)}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  {defaultRenderers.actions(item)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination}
    </div>
  );
}

export default memo(ListingTable);
