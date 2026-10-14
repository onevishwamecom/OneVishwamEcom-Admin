import React from 'react';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-700 border-amber-200/70',
    icon: 'fa-hourglass-half',
  },
  approved: {
    label: 'Approved',
    cls: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    icon: 'fa-circle-check',
  },
  'changes-required': {
    label: 'Changes Required',
    cls: 'bg-brand-orange/10 text-brand-orange border-brand-orange/25',
    icon: 'fa-pen-to-square',
  },
  cancelled: {
    label: 'Cancelled',
    cls: 'bg-rose-50 text-rose-600 border-rose-200/70',
    icon: 'fa-ban',
  },
  active: {
    label: 'Active',
    cls: 'bg-brand-blue/10 text-brand-blue border-brand-blue/25',
    icon: 'fa-circle',
  },
  inactive: {
    label: 'Inactive',
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: 'fa-circle-minus',
  },
};

const AVAILABILITY_STATUS_CONFIG = {
  available: {
    label: 'Available',
    cls: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    icon: 'fa-circle-check',
  },
  sold_out: {
    label: 'Sold Out',
    cls: 'bg-red-50 text-red-600 border-red-200/70',
    icon: 'fa-circle-xmark',
  },
  inactive: {
    label: 'Inactive',
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: 'fa-pause-circle',
  },
};

function availabilityStatusConfig(status) {
  return AVAILABILITY_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: 'fa-circle-info',
  };
}

export function AvailabilityBadge({ status, className = '' }) {
  const cfg = availabilityStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize whitespace-nowrap shadow-xs ${cfg.cls} ${className}`}
    >
      <i className={`fa-solid ${cfg.icon} text-[9px]`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

export function statusConfig(status) {
  return STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: 'fa-circle-info',
  };
}

export function StatusBadge({ status, className = '' }) {
  const cfg = statusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize whitespace-nowrap shadow-xs ${cfg.cls} ${className}`}
    >
      <i className={`fa-solid ${cfg.icon} text-[9px]`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

export function EmptyState({ icon = 'fa-inbox', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mb-5">
        <i className={`fa-solid ${icon} text-3xl text-brand-blue/60`} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      {message && <p className="text-sm font-medium text-slate-500 max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, icon, children, className = '', action }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="h-9 w-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <i className={`fa-solid ${icon} text-sm`} aria-hidden="true" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

/**
 * Reusable Pagination Component
 * Displays 'Showing X to Y of Z results' and page controls like: < 1 2 3 ... 8 9 10 >
 */
export function Pagination({
  total = 0,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  if (total === 0) return null;

  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);

  const getPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  const items = getPageItems();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100/80 bg-white ${className}`}>
      <span className="text-sm font-medium text-slate-500">
        Showing <span className="font-semibold text-slate-700">{start}</span> to{' '}
        <span className="font-semibold text-slate-700">{end}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span> results
      </span>

      <div className="inline-flex items-center rounded-lg border border-slate-200 shadow-sm overflow-hidden divide-x divide-slate-200 text-sm font-medium">
        <button
          type="button"
          onClick={() => page > 1 && onPageChange && onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1 min-w-[32px] flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <i className="fa-solid fa-chevron-left text-xs" />
        </button>

        {items.map((item, idx) => {
          if (item === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2.5 py-1 min-w-[32px] flex items-center justify-center text-slate-400 select-none bg-slate-50/50"
              >
                ...
              </span>
            );
          }

          const isActive = item === page;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange && onPageChange(item)}
              className={`px-3 py-1 min-w-[32px] flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-brand-blue text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => page < totalPages && onPageChange && onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 min-w-[36px] flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <i className="fa-solid fa-chevron-right text-xs" />
        </button>
      </div>
    </div>
  );
}

/**
 * Reusable admin data table.
 */
export function DataTable({
  columns = [],
  rows = [],
  renderRow,
  getRowClassName,
  emptyIcon = 'fa-inbox',
  emptyTitle = 'No data',
  emptyMessage = '',
  className = '',
  page: controlledPage,
  rowsPerPage = 10,
  onPageChange: controlledOnPageChange,
}) {
  const [internalPage, setInternalPage] = React.useState(1);
  const isControlled = controlledOnPageChange !== undefined;

  const page = isControlled ? (controlledPage || 1) : internalPage;
  const onPageChange = isControlled ? controlledOnPageChange : setInternalPage;

  React.useEffect(() => {
    if (!isControlled) {
      setInternalPage(1);
    }
  }, [rows.length, isControlled]);

  const totalCols = columns.length + 1;
  const totalRows = rows.length;

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pagedRows = rows.slice(startIndex, endIndex);

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden max-w-full ${className}`}>
      <div className="overflow-x-auto touch-pan-y w-full max-w-full">
        <table className="min-w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400 border-b-2 border-slate-100">
              <th
                className="px-2 py-2 font-semibold text-[11px] whitespace-nowrap w-8 bg-slate-50 text-center text-slate-400"
                aria-label="Row number"
              >
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-2.5 sm:px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
                    col.className || '',
                  ].join(' ')}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {totalRows === 0 ? (
              <tr>
                <td colSpan={totalCols} className="p-0">
                  <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
                </td>
              </tr>
            ) : (
              pagedRows.map((row, ri) => {
                const cells = renderRow(row, ri);
                const isEvenRow = ri % 2 === 1;
                const customRowClass = getRowClassName ? getRowClassName(row, ri) : '';
                const rowBg = customRowClass || (isEvenRow ? 'bg-slate-50/60' : 'bg-white');
                return (
                  <tr
                    key={row._id || row.id || ri}
                    className={[
                      'border-b border-slate-100 last:border-0 transition-colors cursor-default group h-11 max-h-11',
                      rowBg,
                    ].join(' ')}
                  >
                    <td className="px-2 py-2 text-center text-[11px] font-bold text-slate-300 select-none tabular-nums bg-slate-50">
                      {startIndex + ri + 1}
                    </td>
                    {cells.map((cell, ci) => {
                      const cellProps = cell?.props || {};
                      const { className: cellClass = '', children: cellChildren, ...restCellProps } = cellProps;
                      return (
                        <td
                          key={cell?.key ?? ci}
                          {...restCellProps}
                          className={[
                            'px-2 sm:px-2.5 py-1.5 text-xs align-middle whitespace-nowrap overflow-hidden',
                            cellClass,
                          ].join(' ')}
                        >
                          {cellChildren !== undefined ? cellChildren : cell}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        total={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}