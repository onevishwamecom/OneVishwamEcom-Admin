import client from '../api/client';
import { CATEGORIES as DEFAULT_ADMIN_CATEGORIES } from '../mock/categories';

const CACHE_STORAGE_KEY = 'onevishwam_categories_cache';
const CACHE_VERSION = '1.0.0';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

let inMemoryCache = null;
let inFlightRequest = null;

function normalizeAdminCategory(cat) {
  if (!cat) return null;
  // Normalize icon so it works with `<i className="fa-solid ${cat.icon}" />` or raw
  let cleanIcon = cat.icon || 'fa-table-cells-large';
  cleanIcon = cleanIcon.replace(/^fa-solid\s+/, '').replace(/^fa-regular\s+/, '');

  return {
    ...cat,
    id: cat.id,
    label: cat.label || cat.name,
    icon: cleanIcon,
    rawIcon: cat.icon,
    gradient: cat.gradient || 'from-brand-blue to-brand-blue/70',
    fields: cat.fields || [],
  };
}

/**
 * Returns cached categories synchronously with zero latency
 */
export function getCachedCategories() {
  if (inMemoryCache && Array.isArray(inMemoryCache) && inMemoryCache.length > 0) {
    return inMemoryCache;
  }
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CACHE_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
        inMemoryCache = parsed.data.map(normalizeAdminCategory);
        return inMemoryCache;
      }
    }
  } catch (err) {
    console.warn('[Admin categoriesService] localStorage read error:', err);
  }

  inMemoryCache = DEFAULT_ADMIN_CATEGORIES.map(normalizeAdminCategory);
  return inMemoryCache;
}

/**
 * Fetches latest categories from backend API and synchronizes client cache
 */
export async function fetchCategories({ force = false } = {}) {
  if (inFlightRequest) return inFlightRequest;

  if (!force) {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(CACHE_STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          Array.isArray(parsed.data) &&
          parsed.data.length > 0 &&
          parsed.version === CACHE_VERSION &&
          Date.now() - (parsed.cachedAt || 0) < CACHE_TTL_MS
        ) {
          inMemoryCache = parsed.data.map(normalizeAdminCategory);
          return inMemoryCache;
        }
      }
    } catch {}
  }

  inFlightRequest = (async () => {
    try {
      const res = await client.get('/categories');
      const apiData = res.data?.data || res.data?.categories || res.data;
      if (Array.isArray(apiData) && apiData.length > 0) {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              CACHE_STORAGE_KEY,
              JSON.stringify({
                version: CACHE_VERSION,
                cachedAt: Date.now(),
                data: apiData,
              })
            );
          }
        } catch {}
        inMemoryCache = apiData.map(normalizeAdminCategory);
        return inMemoryCache;
      }
    } catch (err) {
      console.warn('[Admin categoriesService] fetchCategories failed, using cache:', err.message);
    } finally {
      inFlightRequest = null;
    }

    return getCachedCategories();
  })();

  return inFlightRequest;
}

export default {
  getCachedCategories,
  fetchCategories,
};
