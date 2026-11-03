/**
 * ONE CENTRAL CLIENT-SIDE CACHE SERVICE
 * ============================================================================
 * Every page reads/writes through this single abstraction instead of touching
 * localStorage directly. Data is versioned and namespaced so different apps
 * and different users never collide.
 *
 *   storage key →  onevishwam_cache_v<version>_<namespace>_<key>
 *
 * A cached record looks like:
 *   { data, params, cachedAt, version }
 *
 * In-flight requests are de-duplicated so identical concurrent fetches share
 * one promise (no duplicate API calls).
 * ============================================================================
 */

import { memoryCache } from '../../utils/lruCache';

const STORAGE_PREFIX = 'onevishwam_cache';
const CACHE_VERSION = 8;

/** Configurable freshness lifetimes (ms) — tune per data type, never hardcode. */
export const CACHE_TTL = {
  user: 30 * 60 * 1000, // 30 min — profile, revalidated after login
  dashboard: 10 * 1000, // 10 sec — admin stats (short TTL, always revalidates)
  listings: 15 * 1000, // 15 sec — admin listing collections (short TTL for fresh data)
  products: 10 * 60 * 1000, // 10 min — public listing collections
  detail: 15 * 1000, // 15 sec — single listing detail (short TTL for admin review)
  similar: 10 * 60 * 1000, // 10 min — "similar items"
  categories: 10 * 1000, // 10 sec — dynamic category sector counts
  activity: 15 * 1000, // 15 sec — audit trail (short TTL)
};

export const PUBLIC_NAMESPACE = 'public';
export const USER_NAMESPACE = 'user';

/** Namespace scoped to the logged-in admin so accounts never share cached data. */
export function adminNamespace() {
  try {
    const raw = localStorage.getItem('wvz_admin_session');
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.email) return `admin:${session.email}`;
    }
  } catch {
    /* fall through */
  }
  return 'admin:default';
}

/** Deterministic key for parameterised requests (params must be part of the key). */
export function deterministicKey(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  const ordered = {};
  Object.keys(value)
    .sort()
    .forEach((k) => {
      ordered[k] = value[k];
    });
  return JSON.stringify(ordered);
}

function storageKey(namespace, key) {
  return `${STORAGE_PREFIX}_v${CACHE_VERSION}_${namespace}_${key}`;
}

function safeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable / full — cache silently degrades */
  }
}

/** In-flight request map (per storage key) so identical calls share one promise. */
const inflight = new Map();

/** Clear in-flight promises for a specific key or all keys. */
export function clearInflight(key) {
  if (key) {
    inflight.delete(key);
  } else {
    inflight.clear();
  }
}

export const cache = {
  get(namespace, key) {
    const sKey = storageKey(namespace, key);
    const memRecord = memoryCache.get(sKey);
    if (memRecord) return memRecord;

    const diskRecord = safeRead(sKey);
    if (diskRecord) {
      memoryCache.set(sKey, diskRecord);
      return diskRecord;
    }
    return null;
  },

  getWithMetadata(namespace, key) {
    return this.get(namespace, key);
  },

  set(namespace, key, data, params = {}) {
    const record = { data, params, cachedAt: Date.now(), version: CACHE_VERSION };
    const sKey = storageKey(namespace, key);
    memoryCache.set(sKey, record);
    safeWrite(sKey, record);
    return record;
  },

  remove(namespace, key) {
    const sKey = storageKey(namespace, key);
    memoryCache.delete(sKey);
    try {
      localStorage.removeItem(sKey);
    } catch {
      /* ignore */
    }
  },

  /** Remove every cache entry whose key starts with `prefix` in a namespace, or contains `prefix` */
  removeByPrefix(namespace, prefix) {
    const start = `${STORAGE_PREFIX}_v${CACHE_VERSION}_${namespace}_`;
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith(start + prefix) ||
          k.includes(`_${prefix}`) ||
          (prefix && k.endsWith(`_${prefix}`)))
      ) {
        doomed.push(k);
      }
    }
    doomed.forEach((k) => {
      memoryCache.delete(k);
      try {
        localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
    // Invalidate in memory cache
    if (!prefix || prefix.startsWith('listing') || prefix.startsWith('stats')) {
      memoryCache.clear();
    }
  },

  clearNamespace(namespace) {
    this.removeByPrefix(namespace, '');
  },

  clear() {
    memoryCache.clear();
    const start = `${STORAGE_PREFIX}_v${CACHE_VERSION}_`;
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(start)) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  },

  isValid(namespace, key, ttl) {
    const record = this.get(namespace, key);
    if (!record) return false;
    if (ttl == null) return true;
    return Date.now() - (record.cachedAt || 0) < ttl;
  },

  isFresh(record, ttl) {
    return !!record && (ttl == null || Date.now() - (record.cachedAt || 0) < ttl);
  },

  isStale(record, ttl) {
    return !!record && !this.isFresh(record, ttl);
  },

  /**
   * Single entry point for "fetch or reuse".
   *  - valid cache → resolves immediately with cached data (no network)
   *  - no cache → runs `fetcher`, stores the result, returns it
   *  - `force: true` → bypasses valid cache (manual refresh / revalidation)
   * Concurrent identical calls share one in-flight promise.
   */
  async fetch(namespace, key, fetcher, { force = false, ttl, params } = {}) {
    const record = this.get(namespace, key);
    if (!force && record && this.isFresh(record, ttl)) {
      return { fromCache: true, data: record.data };
    }
    const inflightKey = storageKey(namespace, key);
    if (inflight.has(inflightKey)) return inflight.get(inflightKey);
    const promise = Promise.resolve()
      .then(fetcher)
      .then((data) => {
        this.set(namespace, key, data, params);
        return { fromCache: false, data };
      })
      .finally(() => inflight.delete(inflightKey));
    inflight.set(inflightKey, promise);
    return promise;
  },
};

export default cache;