import React from 'react';
import { formatDate } from '../../../../utils';
import { ListingTable, Button, IconButton } from '../../../../components/ui';

export default function BatchCard({
  batch,
  isExpanded,
  onToggle,
  onOpenAddModal,
  onDeleteBatch,
  busyItemId,
  onQuickApprove,
  onOpenEditModal,
  onDeleteItem,
}) {
  const items = batch.items || [];
  const itemCount = batch.itemCount || items.length;
  const pendingCount =
    batch.pendingCount !== undefined
      ? batch.pendingCount
      : items.filter((i) => i.status === 'pending').length;
  const approvedCount =
    batch.approvedCount !== undefined
      ? batch.approvedCount
      : items.filter((i) => i.status === 'approved').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300">
      {/* Header */}
      <div
        onClick={onToggle}
        className={`p-4 cursor-pointer select-none transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
          isExpanded ? 'bg-slate-50/80 border-b border-slate-200/70' : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0"
          >
            <i
              className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-brand-blue' : ''
              }`}
            />
          </button>

          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-file-excel text-base" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-900">
                {batch.batchId}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                {batch.category}
              </span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingCount} Pending Review
                </span>
              )}
              {approvedCount > 0 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {approvedCount} Approved
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
              <span>
                <i className="fa-solid fa-user text-slate-400 mr-1" />
                <b>{batch.listerName || 'Unknown Lister'}</b> ({batch.listerEmail || 'No email'})
              </span>
              <span>·</span>
              <span className="truncate max-w-[200px]" title={batch.filename}>
                <i className="fa-solid fa-file text-slate-400 mr-1" />
                {batch.filename}
              </span>
              <span>·</span>
              <span>
                <b>{itemCount}</b> items
              </span>
              <span>·</span>
              <span>{formatDate(batch.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="emerald-outline"
            size="sm"
            icon="fa-plus"
            onClick={() => onOpenAddModal(batch)}
          >
            Add Item
          </Button>
          <IconButton
            variant="danger-soft"
            size="icon"
            icon="fa-trash"
            onClick={() => onDeleteBatch(batch)}
            title="Delete entire batch"
            aria-label="Delete entire batch"
          />
        </div>
      </div>

      {/* Retractable Items Table */}
      {isExpanded && (
        <div className="border-t border-slate-100 animate-fade-in">
          {items.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No items found in this batch.
            </div>
          ) : (
            <div>
              <ListingTable
                items={items}
                columns={['product', 'subcategory', 'location', 'price', 'status', 'actions']}
                portal="admin"
                getItemLink={(it) => {
                  const targetListingId = it.itemId || it._id;
                  return targetListingId
                    ? `/admin/listings/${encodeURIComponent(batch.category || 'properties')}/${targetListingId}`
                    : '#';
                }}
                busyId={busyItemId}
                responsiveMode="scroll"
                renderCustomActions={(it, isBusy) =>
                  it.status === 'pending' ? (
                    <Button
                      variant="emerald-outline"
                      size="xs"
                      onClick={() => onQuickApprove(batch.batchId, it)}
                      disabled={isBusy}
                      title="Approve item immediately"
                    >
                      Approve
                    </Button>
                  ) : null
                }
                onEdit={(it) => onOpenEditModal(batch, it)}
                onDelete={(it) => onDeleteItem(batch.batchId, it)}
              />

              <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium">
                  Showing {items.length} items in batch <span className="font-mono">{batch.batchId}</span>
                </p>
                <Button
                  variant="ghost"
                  size="xs"
                  icon="fa-plus"
                  onClick={() => onOpenAddModal(batch)}
                  className="text-emerald-700 hover:text-emerald-800"
                >
                  Add Item to Batch
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
