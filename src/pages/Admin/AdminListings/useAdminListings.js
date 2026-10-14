import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAsyncData from '../../../hooks/useAsyncData';
import useListingReadStatus from '../../../hooks/useListingReadStatus';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { TABS } from './constants';

export default function useAdminListings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('activeTab') || 'all';

  const page = useMemo(() => {
    const fromParams = parseInt(searchParams.get('page'), 10);
    if (!isNaN(fromParams) && fromParams > 0) return fromParams;
    try {
      const fromStorage = parseInt(sessionStorage.getItem('admin_listings_page'), 10);
      if (!isNaN(fromStorage) && fromStorage > 0) return fromStorage;
    } catch (e) {}
    return 1;
  }, [searchParams]);

  const setPage = useCallback((newPageOrFn) => {
    const current = parseInt(searchParams.get('page'), 10) || 1;
    const next = typeof newPageOrFn === 'function' ? newPageOrFn(current) : newPageOrFn;
    try {
      sessionStorage.setItem('admin_listings_page', String(next));
    } catch (e) {}
    setSearchParams((prevParams) => {
      const updated = new URLSearchParams(prevParams);
      if (next > 1) {
        updated.set('page', String(next));
      } else {
        updated.delete('page');
      }
      return updated;
    });
  }, [searchParams, setSearchParams]);

  const setActiveTab = useCallback((tabId) => {
    try {
      sessionStorage.setItem('admin_listings_page', '1');
    } catch (e) {}
    setSearchParams((prevParams) => {
      const updated = new URLSearchParams(prevParams);
      if (tabId && tabId !== 'all') {
        updated.set('activeTab', tabId);
      } else {
        updated.delete('activeTab');
      }
      updated.delete('page');
      return updated;
    });
  }, [setSearchParams]);

  const { unseenCount, isUnseen, markAsRead, initializeListings } = useListingReadStatus();

  const { data, loading, error, retry } = useAsyncData(
    async () => {
      const [listings, contributors, categories] = await Promise.all([
        adminApi.getListings(),
        adminApi.getContributors(),
        adminApi.getCategories(),
      ]);
      return { listings, contributors, categories };
    },
    [],
    { listings: [], contributors: [], categories: [] },
    { cacheKey: 'all-listings', ttl: CACHE_TTL.listings },
  );

  const { listings: allListings, contributors, categories } = data;

  useEffect(() => {
    if (allListings.length > 0) {
      initializeListings(allListings);
    }
  }, [allListings, initializeListings]);

  const openListing = useCallback(
    (listing) => {
      const id = listing?._id || listing?.id;
      if (id) markAsRead(id);
    },
    [markAsRead],
  );

  const contributorNameById = useMemo(
    () => Object.fromEntries(contributors.map((c) => [c._id || c.id, c.name])),
    [contributors],
  );
  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  const filtered = useMemo(() => {
    const sorted = [...allListings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    if (activeTab === 'all') return sorted;
    return sorted.filter((l) => l.status === activeTab);
  }, [allListings, activeTab]);

  return {
    TABS,
    activeTab,
    setActiveTab,
    page,
    setPage,
    allListings,
    filtered,
    contributorNameById,
    categoryById,
    unseenCount,
    isUnseen,
    openListing,
    loading,
    error,
    retry,
  };
}