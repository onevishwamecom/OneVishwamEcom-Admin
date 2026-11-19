import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { adminApi } from '../../../api/adminData';
import { PageContainer, PageHeader } from '../../../components/layout/PageContainer';
import { Skeleton } from '../../../components/skeleton';
import { Button, SearchInput } from '../../../components/ui';
import AdminBatchItemModal from './AdminBatchItemModal';
import BatchCard from './components/BatchCard';
import TemplateDownloadLogsTab from './components/TemplateDownloadLogsTab';

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

  // Open modal to add an item
  const handleOpenAddModal = (batch) => {
    setModalState({
      isOpen: true,
      batchId: batch.batchId,
      batchCategory: batch.category || 'properties',
      item: null,
    });
  };

  // Open modal to edit an item
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

  // Save (add or update) an item in a batch
  const handleSaveItem = async (formPayload) => {
    setIsSaving(true);
    try {
      if (modalState.item) {
        const itemId = modalState.item._id || modalState.item.itemId;
        await adminApi.updateBatchItem(modalState.batchId, itemId, {
          ...formPayload,
          status: formPayload.status && formPayload.status !== 'pending' ? formPayload.status : 'approved',
        });
        Swal.fire({
          icon: 'success',
          title: 'Item Updated',
          text: 'The batch item has been updated.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        await adminApi.addBatchItem(modalState.batchId, formPayload);
        Swal.fire({
          icon: 'success',
          title: 'Item Added',
          text: 'New listing item added to batch.',
          timer: 1500,
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
        title: 'Save Failed',
        text: err?.response?.data?.message || err.message || 'Could not save item.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick approve a single item directly
  const handleQuickApprove = async (batchId, item) => {
    const itemId = item._id || item.itemId;
    setBusyItemId(itemId);
    try {
      await adminApi.updateBatchItem(batchId, itemId, { status: 'approved' });
      Swal.fire({
        icon: 'success',
        title: 'Item Approved',
        text: 'The listing is now approved and live.',
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
      list = list.filter((b) => {
        const cat = (b.category || '').toLowerCase();
        const f = batchCategoryFilter.toLowerCase();
        if (f === 'vehicles') return cat === 'vehicles' || cat === 'vehicle' || cat === 'automobile' || cat === 'automobiles';
        if (f === 'groceries') return cat === 'groceries' || cat === 'grocery';
        if (f === 'garments') return cat === 'garments' || cat === 'garment';
        return cat === f;
      });
    }
    if (batchSearch.trim()) {
      const q = batchSearch.trim().toLowerCase();
      list = list.filter((b) => {
        const batchMatches =
          (b.batchId || '').toLowerCase().includes(q) ||
          (b.listerName || '').toLowerCase().includes(q) ||
          (b.listerEmail || '').toLowerCase().includes(q) ||
          (b.filename || '').toLowerCase().includes(q);

        const itemsMatch = (b.items || []).some(
          (it) =>
            (it.title || '').toLowerCase().includes(q) ||
            (it.brand || '').toLowerCase().includes(q) ||
            (it.model || '').toLowerCase().includes(q) ||
            (it.city || '').toLowerCase().includes(q) ||
            (it.area || '').toLowerCase().includes(q)
        );

        return batchMatches || itemsMatch;
      });
    }
    return list;
  }, [batches, batchCategoryFilter, batchSearch]);

  const totalPending = useMemo(() => {
    return batches.reduce((sum, b) => {
      const count =
        b.pendingCount !== undefined
          ? b.pendingCount
          : (b.items || []).filter((i) => i.status === 'pending').length;
      return sum + count;
    }, 0);
  }, [batches]);

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
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
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

      {/* ── TAB 1: BULK BATCHES ── */}
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
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-blue text-slate-700 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="properties">Properties</option>
                <option value="vehicles">Automobiles</option>
                <option value="electronics">Consumer Electronics</option>
                <option value="bedding">Bedding & Comfort</option>
                <option value="groceries">Groceries</option>
                <option value="garments">Garments</option>
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
            <div className="space-y-4">
              {filteredBatches.map((batch) => (
                <BatchCard
                  key={batch.batchId}
                  batch={batch}
                  isExpanded={expandedBatchIds.has(batch.batchId)}
                  onToggle={() => toggleBatch(batch.batchId)}
                  onOpenAddModal={handleOpenAddModal}
                  onDeleteBatch={handleDeleteBatch}
                  busyItemId={busyItemId}
                  onQuickApprove={handleQuickApprove}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteItem={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: TEMPLATE DOWNLOAD LOGS ── */}
      {activeTab === 'logs' && (
        <TemplateDownloadLogsTab
          logsData={logsData}
          loadingLogs={loadingLogs}
          logSearch={logSearch}
          setLogSearch={setLogSearch}
          logCategoryFilter={logCategoryFilter}
          setLogCategoryFilter={setLogCategoryFilter}
          logPage={logPage}
          setLogPage={setLogPage}
          onSearchSubmit={handleLogSearchSubmit}
          onRefresh={() => loadLogs(logPage)}
        />
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
