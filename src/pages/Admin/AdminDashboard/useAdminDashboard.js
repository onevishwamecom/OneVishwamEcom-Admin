import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';

export default function useAdminDashboard() {
  const { data, loading, error, retry } = useAsyncData(
    async () => {
      const [s, c, v] = await Promise.all([
        adminApi.getStats(),
        adminApi.getContributors(),
        adminApi.getVisitorStats().catch(() => null),
      ]);
      const mergedStats = {
        ...(s || {}),
        visitorStats: v || s?.visitorStats || null,
      };
      return { stats: mergedStats, contributors: c };
    },
    [],
    { stats: null, contributors: [] },
    { cacheKey: 'dashboard', ttl: CACHE_TTL.dashboard },
  );

  return {
    stats: data.stats,
    contributors: data.contributors,
    loading,
    error,
    retry,
  };
}