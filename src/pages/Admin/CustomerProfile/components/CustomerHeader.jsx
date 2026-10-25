import { useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CustomerHeader({ customer }) {
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const now = new Date();
  const lastActive = customer.lastActiveAt ? new Date(customer.lastActiveAt) : null;
  const isActiveNow = lastActive && !isNaN(lastActive.getTime()) && (now - lastActive) < 3 * 60 * 1000;

  const cleanPhone = (customer.phone || customer.phoneNumber || '').replace(/[^0-9]/g, '');

  const copyId = () => {
    if (!customer._id) return;
    navigator.clipboard.writeText(String(customer._id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-blue/5 via-indigo-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
        {/* Left: Avatar & Personal Info */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue via-indigo-600 to-brand-navy flex items-center justify-center text-white font-extrabold text-2xl shadow-md border-2 border-white">
                {(customer.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            {isActiveNow && (
              <span
                title="Active on site now"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {customer.name || customer.fullName || 'Customer'}
              </h1>

              {customer.isEmailVerified && (
                <span
                  title="Verified Customer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"
                >
                  <i className="fa-solid fa-circle-check text-emerald-500" />
                  Verified
                </span>
              )}

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${
                  customer.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {customer.status || 'Active'}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                {customer.role || 'Customer'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
              {customer._id && (
                <button
                  type="button"
                  onClick={copyId}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                  title="Click to copy customer ID"
                >
                  <i className="fa-solid fa-id-badge" />
                  <span>ID: {customer._id}</span>
                  <i className={`fa-solid ${copied ? 'fa-check text-emerald-500' : 'fa-copy text-[10px]'}`} />
                </button>
              )}

              {customer.createdAt && (
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar text-slate-400" />
                  Registered: {formatDate(customer.createdAt)}
                </span>
              )}

              {(customer.city || customer.area) && (
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-rose-400" />
                  {[customer.city, customer.area, customer.pincode].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Contact Buttons */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          {cleanPhone && (
            <a
              href={`tel:${cleanPhone}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-2xs"
            >
              <i className="fa-solid fa-phone text-brand-blue" />
              <span>Call Customer</span>
            </a>
          )}

          {cleanPhone && (
            <a
              href={`https://wa.me/91${cleanPhone.length === 10 ? cleanPhone : cleanPhone.slice(-10)}?text=${encodeURIComponent(
                `Hello ${customer.name || 'there'}, this is from OneVishwam. We noticed your interest in our listings and would love to help you find the perfect match.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
              <span>WhatsApp</span>
            </a>
          )}

          {customer.email && customer.email !== 'N/A' && (
            <a
              href={`mailto:${customer.email}?subject=${encodeURIComponent(
                'OneVishwam: Assistance with your searched listings'
              )}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm shadow-brand-blue/20"
            >
              <i className="fa-solid fa-envelope" />
              <span>Send Email</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
