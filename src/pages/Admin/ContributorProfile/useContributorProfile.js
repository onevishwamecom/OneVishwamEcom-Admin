import { useParams } from 'react-router-dom';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';

export default function useContributorProfile() {
  const { id } = useParams();
  const { data, loading, error, retry } = useAsyncData(
    () => adminApi.getContributorDetail(id),
    [id],
    null,
    { cacheKey: `contributor:${id}`, ttl: CACHE_TTL.detail },
  );

  return { data, loading, error, retry };
}