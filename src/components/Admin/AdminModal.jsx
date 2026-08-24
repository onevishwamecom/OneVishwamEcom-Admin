import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable admin modal (approve / request alterations / cancel / override).
 * Rendered via a portal to document.body so `position: fixed` centres on the
 * viewport even when an ancestor carries a transform (e.g. .page-enter).
 */
export default function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  iconClass = 'bg-brand-blue/10 text-brand-blue',
  children,
  footer,
  width = 'max-w-lg',
}) {
  useEffect(() => {
    if (!open) return undefined;
    function handleEscape(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full ${width} rounded-3xl bg-white shadow-float animate-fade-in-up overflow-hidden`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Close dialog"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>

        <div className="px-7 pt-7 pb-5 border-b border-slate-100 flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg shrink-0 ${iconClass}`}>
            {icon && <i className={`fa-solid ${icon}`} aria-hidden="true" />}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
            {subtitle && <p className="text-sm font-medium text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="px-7 py-6 max-h-[60vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/60">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}