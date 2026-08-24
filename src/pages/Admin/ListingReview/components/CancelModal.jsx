import AdminModal from '../../../../components/Admin/AdminModal';

export default function CancelModal({ open, onClose, reason, setReason, onConfirm }) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Cancel / Reject Listing"
      subtitle="The listing will be hidden and marked as cancelled. It is never permanently deleted."
      icon="fa-ban"
      iconClass="bg-rose-100 text-rose-600"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!reason.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-ban" aria-hidden="true" />
            Reject Listing
          </button>
        </>
      }
    >
      <label htmlFor="cancel-reason" className="block text-sm font-semibold text-slate-700 mb-2">
        Reason for cancellation <span className="text-red-500">*</span>
      </label>
      <textarea
        id="cancel-reason"
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain why this listing is being rejected."
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white resize-none transition-all"
      />
      <p className="text-xs font-medium text-slate-400 mt-2">The reason is stored so cancelled listings can be reviewed later.</p>
    </AdminModal>
  );
}