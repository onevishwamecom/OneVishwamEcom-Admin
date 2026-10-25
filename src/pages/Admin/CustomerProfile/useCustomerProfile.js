import { useParams } from 'react-router-dom';
import useAsyncData from '../../../hooks/useAsyncData';
import { adminApi } from '../../../api/adminData';
import { CACHE_TTL } from '../../../services/cache/cacheService';

export default function useCustomerProfile() {
  const { id } = useParams();

  const { data, loading, error, retry } = useAsyncData(
    async () => {
      if (!id) return null;
      try {
        const res = await adminApi.getUserActivity(id);
        if (res?.user) return res.user;
      } catch (err) {
        // Fallback: try finding user in general users list
        const usersRes = await adminApi.getUsers({ search: id });
        const list = usersRes?.users || [];
        const found = list.find((u) => String(u._id) === String(id) || u.email === id);
        if (found) return found;
        throw err;
      }
      return null;
    },
    [id],
    null,
    { cacheKey: `customer:${id}`, ttl: CACHE_TTL.listings }
  );

  return { customer: data, loading, error, retry };
}
