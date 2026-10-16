import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { adminApi } from '../../../api/adminData';
import { formatINR, formatDate } from '../../../utils';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import { Skeleton } from '../../../components/skeleton';
import {
  ListingTable,
  Button,
  IconButton,
  SearchInput,
} from '../../../components/ui';
import AdminBatchItemModal from './AdminBatchItemModal';

export default function AdminBulkListings() {
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'logs'

  // Batches state
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [expandedBatchIds, setExpandedBatchIds] = useState(new Set());
  const [batchCategoryFilter, setBatchCategoryFilter] = useState('all');
  const [batchSearch, setBatchSearch] = useState('');

  // Download logs state
  const [logsData, setLogsData] = useState({ logs: [], total: 0, page: 1, pages: 1 });
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [logPage, setLogPage] = useState(1);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    batchId: null,
    batchCategory: 'properties',
    item: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);

  // Fetch batches
  const loadBatches = async () => {
    setLoadingBatches(true);
    try {
      const data = await adminApi.getBulkBatches();
      const list = Array.isArray(data) ? data : [];
      setBatches(list);

      // Default expand the first batch
      if (list.length > 0) {
        setExpandedBatchIds(new Set([list[0].batchId]));
      }
    } catch (err) {
      console.error('Failed to load bulk batches:', err);
    } finally {
      setLoadingBatches(false);
    }
  };

  // Fetch download logs
  const loadLogs = async (page = 1) => {
    setLoadingLogs(true);
    try {
      const params = {
        page,
        limit: 15,
        category: logCategoryFilter !== 'all' ? logCategoryFilter : undefined,
        search: logSearch.trim() || undefined,
      };
      const data = await adminApi.getTemplateDownloadLogs(params);
      if (data) {
        setLogsData(data);
      }
    } catch (err) {
      console.error('Failed to load download logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs(logPage);
    }
  }, [activeTab, logPage, logCategoryFilter]);

  // Handle Search for logs with debounce or enter
  const handleLogSearchSubmit = (e) => {
    e.preventDefault();
    setLogPage(1);
    loadLogs(1);
  };

  // Toggle batch accordion
  const toggleBatch = (batchId) => {
    setExpandedBatchIds((prev) => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  // Modal open handlers
  const handleOpenAddModal = (batch) => {
    setModalState({
      isOpen: true,
      batchId: batch.batchId,
      batchCategory: batch.category || 'properties',
      item: null,
    });
  };

  const handleOpenEditModal = (batch, item) => {
    setModalState({
      isOpen: true,
      batchId: batch.batchId,
      batchCategory: batch.category || 'properties',
      item,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      batchId: null,
      batchCategory: 'properties',
      item: null,
    });
  };

  // Save (Add / Edit) item
  const handleSaveItem = async (payload) => {
    const { batchId, item } = modalState;
    if (!batchId) return;

    setIsSaving(true);
    try {
      if (item) {
        const itemId = item._id || item.itemId;
        await adminApi.updateBatchItem(batchId, itemId, payload);
        Swal.fire({
          icon: 'success',
          title: 'Item Updated',
          text: 'Listing has been updated.',
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        await adminApi.addItemToBatch(batchId, payload);
        Swal.fire({
          icon: 'success',
          title: 'Item Added',
          text: 'New product added into this batch in pending review phase.',
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }

      handleCloseModal();
      await loadBatches();
    } catch (err) {
      console.error('Failed to save batch item:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to save item',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Approve item
  const handleQuickApprove = async (batchId, item) => {
    const itemId = item._id || item.itemId;
    setBusyItemId(itemId);
    try {
      await adminApi.updateBatchItem(batchId, itemId, { status: 'approved' });
      Swal.fire({
        icon: 'success',
        title: 'Item Approved',
        text: `"${item.title || item.name}" is now approved!`,
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      await loadBatches();
    } catch (err) {
      console.error('Failed to approve item:', err);
      Swal.fire({ icon: 'error', title: 'Action Failed', text: 'Could not approve item.' });
    } finally {
      setBusyItemId(null);
    }
  };

  // Delete item
  const handleDeleteItem = async (batchId, item) => {
    const itemId = item._id || item.itemId;
    const title = item.title || item.name || 'this item';

    const { isConfirmed } = await Swal.fire({
      title: 'Delete Item?',
      text: `Remove "${title}" from batch ${batchId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    });

    if (!isConfirmed) return;

    setBusyItemId(itemId);
    try {
      await adminApi.deleteBatchItem(batchId, itemId);
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Item deleted from batch.',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      await loadBatches();
    } catch (err) {
      console.error('Failed to delete item:', err);
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Could not delete item.' });
    } finally {
      setBusyItemId(null);
    }
  };

  // Delete entire batch
  const handleDeleteBatch = async (batch) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete Entire Bulk Batch?',
      html: `
        <div class="text-left text-sm space-y-2">
          <p>Delete batch <b>${batch.batchId}</b>?</p>
          <div class="p-2.5 bg-rose-50 text-rose-800 rounded-lg text-xs">
            This will permanently delete all <b>${batch.itemCount || batch.items?.length || 0} listings</b> uploaded in this batch.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete batch',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    });

    if (!isConfirmed) return;

    try {
      await adminApi.deleteBatch(batch.batchId);
      Swal.fire({
        icon: 'success',
        title: 'Batch Deleted',
        text: 'Bulk batch and all its items have been removed.',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      await loadBatches();
    } catch (err) {
      console.error('Failed to delete batch:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not delete bulk batch.' });
    }
  };

  // Filtered batches
  const filteredBatches = useMemo(() => {
    let list = batches;
    if (batchCategoryFilter !== 'all') {
      list = list.filter((b) => (b.category || '').toLowerCase() === batchCategoryFilter.toLowerCase());
    }
    if (batchSearch.trim()) {
      const term = batchSearch.toLowerCase();
      list = list.filter((b) => {
        const idMatch = (b.batchId || '').toLowerCase().includes(term);
        const listerMatch =
          (b.listerName || '').toLowerCase().includes(term) ||
          (b.listerEmail || '').toLowerCase().includes(term);
        const fileMatch = (b.filename || '').toLowerCase().includes(term);
        const catMatch = (b.category || '').toLowerCase().includes(term);
        const itemMatch = (b.items || []).some(
          (it) =>
            (it.title || it.name || '').toLowerCase().includes(term) ||
            (it.city || '').toLowerCase().includes(term)
        );
        return idMatch || listerMatch || fileMatch || catMatch || itemMatch;
      });
    }
    return list;
  }, [batches, batchCategoryFilter, batchSearch]);

  const totalPending = batches.reduce(
    (acc, b) => acc + (b.pendingCount || (b.items || []).filter((i) => i.status === 'pending').length),
    0
  );

  return (
    <PageContainer>
      <PageHeader
        title="Bulk Listings Management"
        description="Review grouped bulk upload batches submitted by listers and monitor Excel template download audit logs."
        actions={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <i className="fa-solid fa-clock-rotate-left mr-1" /> {totalPending} Pending Bulk Items
            </span>
          </div>
        }
      />

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('batches')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'batches'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-layer-group text-sm" /> Bulk Upload Batches
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
            {batches.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'logs'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left text-sm" /> Template Download Logs
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
            {logsData.total || 0}
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 1: BULK BATCHES (GROUPED & RETRACTABLE TABLES)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <SearchInput
                value={batchSearch}
                onChange={(val) => setBatchSearch(val)}
                placeholder="Search batches, lister name, email, item title..."
                wrapperClassName="flex-1"
              />

              <select
                value={batchCategoryFilter}
                onChange={(e) => setBatchCategoryFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-blue text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="properties">Properties</option>
                <option value="vehicle">Vehicles</option>
                <option value="grocery">Groceries</option>
                <option value="garment">Garments</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon="fa-rotate"
                onClick={loadBatches}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedBatchIds(new Set(batches.map((b) => b.batchId)))}
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedBatchIds(new Set())}
              >
                Collapse All
              </Button>
            </div>
          </div>

          {loadingBatches ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-layer-group text-xl" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">No Bulk Upload Batches Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No bulk listing batches have been uploaded yet or no batches match your search criteria.
              </p>
            </div>
          ) : (
            /* Batches Accordion */
            <div className="space-y-4">
              {filteredBatches.map((batch) => {
                const isExpanded = expandedBatchIds.has(batch.batchId);
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
                  <div
                    key={batch.batchId}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                  >
                    {/* Header */}
                    <div
                      onClick={() => toggleBatch(batch.batchId)}
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
                          onClick={() => handleOpenAddModal(batch)}
                        >
                          Add Item
                        </Button>
                        <IconButton
                          variant="danger-soft"
                          size="icon"
                          icon="fa-trash"
                          onClick={() => handleDeleteBatch(batch)}
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
                                    onClick={() => handleQuickApprove(batch.batchId, it)}
                                    disabled={isBusy}
                                    title="Approve item immediately"
                                  >
                                    Approve
                                  </Button>
                                ) : null
                              }
                              onEdit={(it) => handleOpenEditModal(batch, it)}
                              onDelete={(it) => handleDeleteItem(batch.batchId, it)}
                            />

                            <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                              <p className="text-[11px] text-slate-500 font-medium">
                                Showing {items.length} items in batch <span className="font-mono">{batch.batchId}</span>
                              </p>
                              <Button
                                variant="ghost"
                                size="xs"
                                icon="fa-plus"
                                onClick={() => handleOpenAddModal(batch)}
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
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: TEMPLATE DOWNLOAD LOGS (AUDIT TRAIL)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <form onSubmit={handleLogSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass text-slate-400 absolute left-3 top-2.5 text-xs" />
                <input
                  type="search"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search by lister name, email, or filename..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-xl transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2">
              <select
                value={logCategoryFilter}
                onChange={(e) => {
                  setLogCategoryFilter(e.target.value);
                  setLogPage(1);
                }}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-blue text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="properties">Properties</option>
                <option value="vehicle">Vehicles</option>
                <option value="grocery">Groceries</option>
                <option value="garment">Garments</option>
                <option value="jewellery">Jewellery</option>
              </select>

              <button
                type="button"
                onClick={() => loadLogs(logPage)}
                className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <i className="fa-solid fa-rotate text-xs" /> Refresh
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loadingLogs ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : logsData.logs?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-clock-rotate-left text-xl" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No Template Download Logs</h3>
                <p className="text-xs text-slate-500">
                  No listers have downloaded bulk listing templates yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                      <th className="px-4 py-3">Lister</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Downloaded Filename</th>
                      <th className="px-4 py-3">Downloaded At</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3">Device / User Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {logsData.logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{log.listerName || 'Unknown Lister'}</p>
                          <p className="text-[11px] text-slate-500">{log.listerEmail || 'No email'}</p>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                            {log.category}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-mono text-[11px] text-slate-800">
                          <i className="fa-solid fa-file-excel text-emerald-600 mr-1.5" />
                          {log.filename}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                          {formatDate(log.downloadedAt || log.createdAt)}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {log.ip || '—'}
                        </td>

                        <td className="px-4 py-3 max-w-[220px] truncate text-[11px] text-slate-500" title={log.userAgent}>
                          {log.userAgent || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {logsData.pages > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Page {logsData.page} of {logsData.pages} ({logsData.total} logs)
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                    disabled={logPage <= 1}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogPage((p) => Math.min(logsData.pages, p + 1))}
                    disabled={logPage >= logsData.pages}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Item Modal */}
      <AdminBatchItemModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={modalState.item}
        batchCategory={modalState.batchCategory}
        isSaving={isSaving}
      />
    </PageContainer>
  );
}
