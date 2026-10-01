import React from 'react';

export default function Field({ label, value }) {
  const displayValue = typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : (value !== undefined && value !== null && String(value).trim() !== '' ? String(value) : '—');

  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 break-words">{displayValue}</p>
    </div>
  );
}