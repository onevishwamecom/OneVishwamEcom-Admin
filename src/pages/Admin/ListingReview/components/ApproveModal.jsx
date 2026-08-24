import AdminModal from '../../../../components/Admin/AdminModal';

export default function ApproveModal({ open, onClose, listing, onConfirm }) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Approve Listing?"
      subtitle="This listing will become visible as an approved listing."
      icon="fa-circle-check"
      iconClass="bg-emerald-100 text-emerald-600"
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            <i className="fa-solid fa-circle-check" aria-hidden="true" />
            Approve Listing
          </button>
        </>
      }
    >
      <p className="text-sm font-medium text-slate-600 leading-relaxed">
        The listing <strong>{listing.title}</strong> will be marked as approved and become publicly visible.
      </p>
    </AdminModal>
  );
}