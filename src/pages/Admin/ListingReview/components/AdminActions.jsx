const ACTIONS = [
  {
    id: 'approve',
    label: 'Approve',
    icon: 'fa-circle-check',
    cls: 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-700',
    onClick: (setActiveModal) => setActiveModal('approve'),
  },
  {
    id: 'alterations',
    label: 'Request Alterations',
    icon: 'fa-pen-to-square',
    cls: 'border-amber-200 bg-amber-50/60 hover:bg-amber-50 text-amber-700',
    onClick: (setActiveModal, setReason) => { setReason(''); setActiveModal('alterations'); },
  },
  {
    id: 'cancel',
    label: 'Cancel / Reject',
    icon: 'fa-ban',
    cls: 'border-rose-200 bg-rose-50/60 hover:bg-rose-50 text-rose-600',
    onClick: (setActiveModal, setReason) => { setReason(''); setActiveModal('cancel'); },
  },
  {
    id: 'override',
    label: 'Override Information',
    icon: 'fa-pen',
    cls: 'border-brand-blue/25 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue',
    onClick: (setActiveModal, setReason, startOverride) => startOverride(),
  },
];

export default function AdminActions({ setActiveModal, setReason, startOverride }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-gavel text-brand-blue" aria-hidden="true" />
        Admin Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => a.onClick(setActiveModal, setReason, startOverride)}
            className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 transition-colors group ${a.cls}`}
          >
            <i className={`fa-solid ${a.icon} text-xl transition-transform group-hover:scale-110`} aria-hidden="true" />
            <span className="text-sm font-bold">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}