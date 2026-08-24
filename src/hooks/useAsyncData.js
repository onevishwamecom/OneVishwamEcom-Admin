import { useCallback, useEffect, useRef, useState } from 'react';
import cache, { adminNamespace } from '../services/cache/cacheService';

/**
 * useAsyncData — standardised API-loading lifecycle: LOADING → SUCCESS | EMPTY | ERROR.
 *
 * Optionally cache-backed (pass `options.cacheKey`). When caching is enabled:
 *   valid cache     → cached data immediately, NO skeleton, NO network request
 *   stale cache     → cached data immediately + background revalidation
 *   no cache        → skeleton → API → cache → display
 *   API failure     → keep showing cached data (no blank error page)
 *
 * `retry()` bypasses the cache (manual refresh) when caching is enabled.
 * Concurrent identical requests are de-duplicated inside the cache service.
 *
 * @param {Function} loader   async function returning the payload
 * @param {Array}    deps     dependencies that re-trigger the request
 * @param {*}        fallback default data value before first load
 * @param {Object}   options  { cacheKey, ttl, namespace } — omit cacheKey for
 *                            the legacy uncached behaviour.
 */
export default function useAsyncData(loader, deps = [], fallback = null, options = {}) {
  const { cacheKey, ttl, namespace } = options;
  const ns = namespace || adminNamespace();

  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const cachedAtMount = useRef(cacheKey ? cache.get(ns, cacheKey) : null);

  const [data, setData] = useState(() => {
    if (cacheKey && cachedAtMount.current) return cachedAtMount.current.data;
    return fallback;
  });
  const [loading, setLoading] = useState(() => {
    if (cacheKey && cachedAtMount.current) return false;
    return true;
  });
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [force, setForce] = useState(0);

  const depKey = deps
    .map((d) => (typeof d === 'object' ? JSON.stringify(d) : String(d)))
    .join('|');

  useEffect(() => {
    let cancelled = false;

    // Legacy uncached path (kept for backward compatibility).
    if (!cacheKey) {
      setLoading(true);
      setError(null);
      loaderRef
        .current()
        .then((result) => {
          if (cancelled) return;
          setData(result);
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }

    const record = cache.get(ns, cacheKey);

    // Show whatever we have immediately — cached data keeps the page usable
    // during any refetch.
    if (record) {
      setData(record.data);
      setLoading(false);
      setError(null);
    } else if (!force && !attempt) {
      // Nothing cached and this is a first load → skeleton.
      setLoading(true);
      setError(null);
    }

    // Fresh cache and not a forced refresh → still do a background revalidation
    // so data stays current (e.g. lister edits from another portal).
    // Only skip the network if this is an explicit no-fetch scenario.
    if (record && !force && cache.isValid(ns, cacheKey, ttl)) {
      // Background revalidation: fetch fresh data without showing skeleton
      cache
        .fetch(ns, cacheKey, () => loaderRef.current(), { force: true, ttl })
        .then(({ data: fresh }) => {
          if (cancelled) return;
          setData(fresh);
        })
        .catch(() => {
          // Background revalidation failed — keep showing cached data
        });
      return () => {
        cancelled = true;
      };
    }

    // No usable cache (or forced) → fetch; `force:true` bypasses freshness so
    // `retry()` always pulls from the network. De-duplicated in cacheService.
    cache
      .fetch(ns, cacheKey, () => loaderRef.current(), { force, ttl })
      .then(({ data: fresh }) => {
        if (cancelled) return;
        setData(fresh);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [depKey, attempt, force, cacheKey, ns, ttl]);

  const retry = useCallback(() => {
    if (cacheKey) {
      setForce((n) => n + 1); // bypass cache and revalidate
    } else {
      setAttempt((n) => n + 1);
    }
  }, [cacheKey]);

  return { data, loading, error, retry };
}