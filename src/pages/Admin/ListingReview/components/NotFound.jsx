import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-5">
        <i className="fa-solid fa-triangle-exclamation text-3xl text-brand-orange" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Listing not found</h3>
      <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">
        This listing may have been deleted from the local prototype store.
      </p>
      <Link to="/admin/listings" className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-blue/90 transition-colors">
        <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
        Back to Listings
      </Link>
    </div>
  );
}