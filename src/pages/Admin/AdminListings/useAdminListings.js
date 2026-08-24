import { useMemo, useState, useEffect, useCallback } from 'react';
import useAsyncData from '../../../hooks/useAsyncData';
import useListingReadStatus from '../../../hooks/useListingReadStatus';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';
import { TABS } from './constants';

export default function useAdminListings() {
  const [activeTab, setActiveTab] = useState('all');
  const { unseenCount, isUnseen, markAsRead, initializeListings } = useListingReadStatus();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlActiveTab = urlParams.get('activeTab');
    if (urlActiveTab) {
      setActiveTab(urlActiveTab);
    }
  }, []);

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