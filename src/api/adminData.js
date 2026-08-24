import client from './client';
import cache, { adminNamespace } from '../services/cache/cacheService';
import { CATEGORIES, typeKeyOf } from '../mock/categories';

/**
 * Admin data-access layer — serves data from the OneVishwam dummy API.
 * ============================================================================
 * All admin data comes from the shared dummy server (`server/dummy-api.mjs`,
 * persisted in `server/db.json`). In development the Vite proxy forwards
 * `/api` to http://localhost:5002; for other environments set
 * VITE_API_BASE_URL (e.g. the deployed API origin).
 * ============================================================================
 */

/** Deduplicate identical concurrent GETs (e.g. getCategories -> getListings). */
const inFlight = new Map();

function dedupe(key, fn) {
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

export function listingType(category) {
  return typeKeyOf(category) || 'properties';
}

function normalizeListing(item) {
  const type = item._type || listingType(item.category);
  return { ...item, _type: type };
}

function unwrap(response) {
  const body = response?.data;
  return body && body.success !== undefined ? body.data : body;
}

async function getStats() {
  return dedupe('stats', () => client.get('/admin/stats').then(unwrap));
}

async function getContributors() {
  return dedupe('contributors', () =>
    client.get('/contributors').then(unwrap).then((data) => data || []),
  );
}

async function getContributorDetail(id) {
  return dedupe(`contributor:${id}`, async () => {
    const data = unwrap(await client.get(`/contributors/${encodeURIComponent(id)}`));
    if (!data) return null;
    return {
      ...data.contributor,
      stats: data.stats || {},
      items: (data.items || []).map(normalizeListing),
    };
  });
}

async function getListings() {
  return dedupe('listings', async () => {
    const items = unwrap(await client.get('/listings', { params: { flatten: '1' } }));
    return (items || []).map(normalizeListing);
  });
}

async function getListing(type, id) {
  return dedupe(`listing:${type}:${id}`, async () => {
    const item = unwrap(
      await client.get(`/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`),
    );
    return item ? normalizeListing(item) : null;
  });
}

async function getCategories() {
  const items = await getListings();
  const byType = {};
  items.forEach((item) => {
    const stats = (byType[item._type] ||= {
      total: 0,
      pending: 0,
      approved: 0,
      changesRequired: 0,
      cancelled: 0,
    });
    stats.total += 1;
    if (item.status === 'pending') stats.pending += 1;
    else if (item.status === 'approved') stats.approved += 1;
    else if (item.status === 'changes-required') stats.changesRequired += 1;
    else if (item.status === 'cancelled') stats.cancelled += 1;
  });
  return CATEGORIES.map((category) => ({
    id: category.id,
    ...category,
    ...(byType[category.id] || {
      total: 0,
      pending: 0,
      approved: 0,
      changesRequired: 0,
      cancelled: 0,
    }),
  }));
}

async function getActivity() {
  return dedupe('activity', async () => {
    const items = unwrap(await client.get('/activity'));
    return (items || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });
}

/**
 * Any mutation that changes listing / category / dashboard data invalidates the
 * affected caches (never the whole localStorage). Keys are admin-scoped.
 */
function invalidateDataCaches() {
  const ns = adminNamespace();
  [
    'listings',
    'all-listings',
    'listed-items',
    'dashboard',
    'contributors',
    'categories',
    'activity',
  ].forEach((key) => cache.remove(ns, key));
  cache.removeByPrefix(ns, 'listing:');
  cache.removeByPrefix(ns, 'contributor:');
}

async function updateListing(type, id, updates) {
  const item = unwrap(
    await client.patch(`/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, updates),
  );
  invalidateDataCaches();
  return item ? normalizeListing(item) : null;
}

async function deleteListing(type, id) {
  const removed = unwrap(
    await client.delete(`/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`),
  );
  invalidateDataCaches();
  return removed;
}

export const adminApi = {
  getStats,
  getContributors,
  getContributorDetail,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getCategories,
  getActivity,
};

export default adminApi;