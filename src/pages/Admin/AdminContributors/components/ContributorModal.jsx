import React from 'react';
import { createPortal } from 'react-dom';
import useAsyncData from '../../../../hooks/useAsyncData';
import { adminApi } from '../../../../api/adminData';
import { CACHE_TTL } from '../../../../services/cache/cacheService';
import { ListingTable, Button, IconButton } from '../../../../components/ui';

export default function ContributorModal({ contributor, onClose }) {
  const contributorId = contributor?._id || contributor?.id;
  const { data, loading } = useAsyncData(
    () => adminApi.getContributorDetail(contributorId),
    [contributorId],
    null,
    { cacheKey: `contributor:${contributorId}`, ttl: CACHE_TTL.detail },
  );

  if (!contributor) return null;

  const contributorListings = data?.items || [];
  const contactPhone = data?.phone || contributor.phone || data?.contact || contributor.contact || '';
  const contactEmail = data?.email || contributor.email || '';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Contributor Details</h2>
            {contributorId && (
              <Button
                variant="blue"
                size="xs"
                icon="fa-arrow-up-right-from-square"
                iconPosition="right"
                to={`/admin/contributors/${encodeURIComponent(contributorId)}`}
              >
                Full Profile
              </Button>
            )}
          </div>
          <IconButton
            icon="fa-xmark"
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close"
            aria-label="Close"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Info Section */}
          <div className="flex items-center gap-5 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white text-3xl font-extrabold shadow-sm shrink-0">
              {contributor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{contributor.name}</h3>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2 font-medium">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <i className="fa-solid fa-phone text-slate-400"></i>
                  </div>
                  {contactPhone || '—'}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <i className="fa-solid fa-envelope text-slate-400"></i>
                  </div>
                  {contactEmail || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800">Contributions ({contributorListings.length})</h4>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="px-6 py-8 text-center text-sm font-medium text-slate-400">
                Loading contributions…
              </div>
            ) : (
              <ListingTable
                items={contributorListings}
                columns={['product', 'category', 'price', 'status']}
                portal="admin"
                responsiveMode="scroll"
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
