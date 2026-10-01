import React from 'react';

export default function AdminActions({ listing, setActiveModal, setReason, startOverride, confirmSoldOut }) {
  const isSoldOut = listing?.availabilityStatus === 'sold_out';
  const status = listing?.status || 'pending';

  const isApproved = status === 'approved';
  const isChangesRequired = status === 'changes-required';
  const isCancelled = status === 'cancelled' || status === 'rejected';

  const actions = [
    {
      id: 'approve',
      label: 'Approve',
      icon: 'fa-circle-check',
      disabled: isApproved,
      cls: isApproved
        ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
        : 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-300',
      onClick: () => {
        if (!isApproved) setActiveModal('approve');
      },
    },
    {
      id: 'alterations',
      label: isChangesRequired ? 'Changes Requested' : 'Request Alterations',
      icon: 'fa-pen-to-square',
      disabled: isChangesRequired,
      cls: isChangesRequired
        ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
        : 'border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-700 hover:border-amber-300',
      onClick: () => {
        if (!isChangesRequired) {
          setReason('');
          setActiveModal('alterations');
        }
      },
    },
    {
      id: 'cancel',
      label: isCancelled ? 'Cancelled' : 'Cancel / Reject',
      icon: 'fa-ban',
      disabled: isCancelled,
      cls: isCancelled
        ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
        : 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 hover:border-rose-300',
      onClick: () => {
        if (!isCancelled) {
          setReason('');
          setActiveModal('cancel');
        }
      },
    },
    {
      id: 'override',
      label: 'Override Information',
      icon: 'fa-pen',
      disabled: false,
      cls: 'border-brand-blue/25 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue hover:border-brand-blue/40',
      onClick: () => startOverride?.(),
    },
    {
      id: 'soldOut',
      label: isSoldOut ? 'Mark as Available' : 'Mark as Sold Out',
      icon: isSoldOut ? 'fa-circle-check' : 'fa-circle-xmark',
      disabled: false,
      cls: isSoldOut
        ? 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-300'
        : 'border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 hover:border-red-300',
      onClick: () => confirmSoldOut?.(),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
        <i className="fa-solid fa-gavel text-brand-blue" aria-hidden="true" />
        Admin Actions
      </h3>
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={a.disabled}
            onClick={a.onClick}
            title={a.disabled ? `Listing is already ${a.label}` : a.label}
            className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all duration-150 shadow-2xs ${a.cls}`}
          >
            <i className={`fa-solid ${a.icon} text-sm transition-transform ${!a.disabled ? 'group-hover:scale-110' : ''}`} aria-hidden="true" />
            <span className="whitespace-nowrap">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}