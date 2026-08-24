/**
 * ErrorState — reusable error/retry UI shown when an API request fails.
 * Mirrors the app's EmptyState styling so the visual language stays consistent.
 */
export function ErrorState({
  icon = 'fa-triangle-exclamation',
  title = 'Unable to load data',
  message = 'Something went wrong while loading. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4" role="alert">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center mb-5 border border-rose-100">
        <i className={`fa-solid ${icon} text-3xl text-rose-400`} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      {message && <p className="text-sm font-medium text-slate-500 max-w-sm">{message}</p>}
      {onRetry && (
        <div className="mt-6">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue text-white px-5 py-2.5 text-sm font-bold hover:bg-brand-blue/90 transition-colors"
          >
            <i className="fa-solid fa-rotate-right text-xs" aria-hidden="true" />
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;