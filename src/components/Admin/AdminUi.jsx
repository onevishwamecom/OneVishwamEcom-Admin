import React from 'react';
import LottieFeedbackAnimation from '../ui/LottieFeedbackAnimation';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-700 border-amber-200/70',
    icon: 'fa-hourglass-half',
  },
  approved: {
    label: 'Approved',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    icon: 'fa-check',
  },
  'changes-required': {
    label: 'Changes Req.',
    cls: 'bg-violet-50 text-violet-700 border-violet-200/70',
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
    label: 'In Stock',
    cls: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-emerald-500',
  },
  sold_out: {
    label: 'Sold Out',
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  inactive: {
    label: 'Inactive',
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};

function availabilityStatusConfig(status) {
  return AVAILABILITY_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  };
}

export function AvailabilityBadge({ status, className = '' }) {
  const cfg = availabilityStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border capitalize whitespace-nowrap shadow-2xs ${cfg.cls} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot || 'bg-slate-400'}`} aria-hidden="true" />
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
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border capitalize whitespace-nowrap shadow-2xs ${cfg.cls} ${className}`}
    >
      <i className={`fa-solid ${cfg.icon} text-[8px]`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

export function EmptyState({
  icon = 'fa-inbox',
  title,
  message,
  action,
  animationType = 'emptyCatalog',
  showAnimation = true,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xs text-center px-4 animate-fade-in ${className}`}>
      {showAnimation ? (
        <div className="mb-2">
          <LottieFeedbackAnimation type={animationType} size="md" fallbackIcon={`fa-solid ${icon}`} />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mb-4">
          <i className={`fa-solid ${icon} text-2xl text-brand-blue/60`} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{title}</h3>
      {message && <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
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
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Near the beginning: 1 2 3 4 5 … total
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '…', total];
  }
  // Near the end: 1 … (total-4) (total-3) (total-2) (total-1) total
  if (current >= total - 3) {
    return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  }
  // In the middle: 1 … (current-1) current (current+1) … total
  return [1, '…', current - 1, current, current + 1, '…', total];
}

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

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 ${className}`}>
      <p className="text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-slate-700">{start}–{end}</span> of{' '}
        <span className="font-bold text-slate-700">{total}</span> items
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end" role="navigation" aria-label="Table pagination">
          <button
            type="button"
            onClick={() => page > 1 && onPageChange && onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs shadow-2xs cursor-pointer"
          >
            <i className="fa-solid fa-chevron-left text-[9px]" aria-hidden="true" />
          </button>

          {getPageNumbers(page, totalPages).map((value, i) =>
            value === '…' ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-xs font-bold text-slate-400 flex items-center justify-center">
                …
              </span>
            ) : (
              <button
                key={value}
                type="button"
                onClick={() => onPageChange && onPageChange(value)}
                aria-current={value === page ? 'page' : undefined}
                aria-label={`Page ${value}`}
                className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  value === page
                    ? 'bg-brand-blue text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-2xs'
                }`}
              >
                {value}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => page < totalPages && onPageChange && onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs shadow-2xs cursor-pointer"
          >
            <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable canonical admin data table matching OneVishwam standard.
 */
export function DataTable({
  columns = [],
  rows = [],
  renderRow,
  getRowClassName,
  onRowClick,
  emptyIcon = 'fa-inbox',
  emptyTitle = 'No data',
  emptyMessage = '',
  emptyAnimationType = 'emptyCatalog',
  className = '',
  page: controlledPage,
  rowsPerPage = 10,
  onPageChange: controlledOnPageChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  searchActions,
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
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden max-w-full ${className}`}>
      {/* Optional integrated search / toolbar bar */}
      {(onSearchChange || searchActions) && (
        <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between gap-2.5 flex-wrap">
          {onSearchChange && (
            <div className="relative flex-1 min-w-[200px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-150"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          )}
          {searchActions && (
            <div className="flex items-center gap-2">
              {searchActions}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto touch-pan-y w-full max-w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80 bg-slate-50/80">
              <th
                className="px-3 py-2.5 font-bold text-center w-8 text-slate-400 select-none"
                aria-label="Row number"
              >
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-3 py-2.5 font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
                    col.className || '',
                  ].join(' ')}
                >
                  {col.header ? col.header(col) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {totalRows === 0 ? (
              <tr>
                <td colSpan={totalCols} className="p-0">
                  <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} animationType={emptyAnimationType} />
                </td>
              </tr>
            ) : (
              pagedRows.map((row, ri) => {
                const cells = renderRow(row, ri);
                const isEvenRow = ri % 2 === 1;
                const customRowClass = getRowClassName ? getRowClassName(row, ri) : '';
                const rowBg = customRowClass || (isEvenRow ? 'bg-slate-50/40' : 'bg-white');
                return (
                  <tr
                    key={row._id || row.id || ri}
                    onClick={(e) => {
                      if (e.target.closest('button, a, input, select')) return;
                      onRowClick && onRowClick(row, ri);
                    }}
                    className={[
                      'border-b border-slate-100 last:border-0 transition-colors group hover:bg-blue-50/40',
                      onRowClick ? 'cursor-pointer' : 'cursor-default',
                      rowBg,
                    ].join(' ')}
                  >
                    <td className="px-2 py-2 text-center text-[11px] font-mono font-semibold text-slate-400 select-none tabular-nums bg-slate-50/50 w-8">
                      {startIndex + ri + 1}
                    </td>
                    {cells.map((cell, ci) => {
                      if (React.isValidElement(cell) && cell.type === 'td') {
                        const { className: cellClass = '', ...restProps } = cell.props || {};
                        return React.cloneElement(cell, {
                          key: cell.key ?? ci,
                          ...restProps,
                          className: [
                            'px-3 py-2 text-xs align-middle',
                            cellClass,
                          ].join(' '),
                        });
                      }
                      return (
                        <td
                          key={cell?.key ?? ci}
                          className="px-3 py-2 text-xs align-middle text-slate-700"
                        >
                          {cell}
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