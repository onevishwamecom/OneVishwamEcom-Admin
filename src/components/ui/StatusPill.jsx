import React from 'react';

export const DEFAULT_STATUS_CONFIG = {
  pending: {
    label: 'Pending Approval',
    icon: 'fa-regular fa-clock',
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  approved: {
    label: 'Approved',
    icon: 'fa-regular fa-circle-check',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  },
  'changes-required': {
    label: 'Changes Required',
    icon: 'fa-regular fa-pen-to-square',
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'fa-regular fa-circle-xmark',
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  rejected: {
    label: 'Rejected',
    icon: 'fa-regular fa-circle-xmark',
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  active: {
    label: 'Active',
    icon: 'fa-solid fa-circle',
    className: 'bg-blue-50 text-blue-700 border-blue-200/80',
  },
  inactive: {
    label: 'Inactive',
    icon: 'fa-solid fa-circle-minus',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

/**
 * Reusable StatusPill matching screenshot design reference.
 */
export function StatusPill({ status = 'pending', label, icon, size = 'sm', className = '', cfgMap }) {
  const key = String(status || 'pending').toLowerCase();
  const cfg = cfgMap?.[key] || DEFAULT_STATUS_CONFIG[key] || DEFAULT_STATUS_CONFIG.pending;

  const displayLabel = label || cfg.label;
  const displayIcon = icon || cfg.icon;

  const sizeClasses =
    size === 'xs' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-3 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold border rounded-full whitespace-nowrap shadow-2xs ${sizeClasses} ${cfg.className} ${className}`}
    >
      {displayIcon && <i className={`${displayIcon} text-[10px] shrink-0`} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </span>
  );
}

export default StatusPill;
