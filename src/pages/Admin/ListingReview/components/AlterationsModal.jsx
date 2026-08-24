import AdminModal from '../../../../components/Admin/AdminModal';

export default function AlterationsModal({ open, onClose, reason, setReason, onConfirm }) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Request Alterations"
      subtitle="Send the contributor a reason for the required changes."
      icon="fa-pen-to-square"
      iconClass="bg-amber-100 text-amber-700"
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
            Send Request
          </button>
        </>
      }
    >
      <label htmlFor="alteration-reason" className="block text-sm font-semibold text-slate-700 mb-2">
        Reason for Changes <span className="text-red-500">*</span>
      </label>
      <textarea
        id="alteration-reason"
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Please update the property area and upload a clearer exterior image."
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white resize-none transition-all"
      />
      <p className="text-xs font-medium text-slate-400 mt-2">A comment is required before sending.</p>
    </AdminModal>
  );
}