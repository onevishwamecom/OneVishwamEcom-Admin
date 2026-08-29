import React from 'react';

const ACTIONS = [
  {
    id: 'approve',
    label: 'Approve',
    icon: 'fa-circle-check',
    cls: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-300',
    onClick: ({ setActiveModal }) => setActiveModal('approve'),
  },
  {
    id: 'alterations',
    label: 'Request Alterations',
    icon: 'fa-pen-to-square',
    cls: 'border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-700 hover:border-amber-300',
    onClick: ({ setActiveModal, setReason }) => { setReason(''); setActiveModal('alterations'); },
  },
  {
    id: 'cancel',
    label: 'Cancel / Reject',
    icon: 'fa-ban',
    cls: 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 hover:border-rose-300',
    onClick: ({ setActiveModal, setReason }) => { setReason(''); setActiveModal('cancel'); },
  },
  {
    id: 'override',
    label: 'Override Information',
    icon: 'fa-pen',
    cls: 'border-brand-blue/25 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue hover:border-brand-blue/40',
    onClick: ({ startOverride }) => startOverride?.(),
  },
  {
    id: 'soldOut',
    label: 'Mark as Sold Out',
    icon: 'fa-circle-xmark',
    cls: 'border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 hover:border-red-300',
    onClick: ({ confirmSoldOut }) => confirmSoldOut?.(),
  },
];

export default function AdminActions({ listing, setActiveModal, setReason, startOverride, confirmSoldOut }) {
  const ctx = { setActiveModal, setReason, startOverride, confirmSoldOut };
  const isSoldOut = listing?.availabilityStatus === 'sold_out';

  const actions = [
    ...ACTIONS.slice(0, 4),
    {
      id: 'soldOut',
      label: isSoldOut ? 'Mark as Available' : 'Mark as Sold Out',
      icon: isSoldOut ? 'fa-circle-check' : 'fa-circle-xmark',
      cls: isSoldOut
        ? 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-300'
        : 'border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 hover:border-red-300',
      onClick: ({ confirmSoldOut }) => confirmSoldOut?.(),
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
            onClick={() => a.onClick(ctx)}
            className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all duration-150 shadow-2xs hover:shadow-xs group ${a.cls}`}
          >
            <i className={`fa-solid ${a.icon} text-sm transition-transform group-hover:scale-110`} aria-hidden="true" />
            <span className="whitespace-nowrap">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}