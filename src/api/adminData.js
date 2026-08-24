import client from './client';
import cache, { adminNamespace } from '../services/cache/cacheService';
import { CATEGORIES } from '../mock/categories';

const inFlight = new Map();

function dedupe(key, fn) {
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

export function listingType(category) {
  const map = {
    'real-estate': 'properties',
    vehicle: 'vehicles',
    grocery: 'groceries',
    garment: 'garments',
    jewellery: 'jewellery',
    finance: 'finance',
  };
  return map[category] || 'properties';
}

function normalizeListing(item) {
  const type = item._type || listingType(item.category);
  return { ...item, _type: type };
}

function unwrap(response) {
  const body = response?.data;
  return body && body.success !== undefined ? body.data : body;
}

function flattenResults(data) {
  if (!data?.results) return [];
  const all = [];
  for (const [type, items] of Object.entries(data.results)) {
    if (Array.isArray(items)) {
      items.forEach((item) => all.push({ ...item, _type: type }));
    }
  }
  return all;
}

async function getStats() {
  return dedupe('stats', () => client.get('/admin/listings/stats').then(unwrap));
}

async function getContributors() {
  return dedupe('contributors', () =>
    client.get('/admin/contributors').then(unwrap).then((data) => data?.contributors || []),
  );
}

async function getContributorDetail(id) {
  return dedupe(`contributor:${id}`, async () => {
    const data = unwrap(await client.get(`/admin/contributors/${encodeURIComponent(id)}`));
    if (!data) return null;
    const items = [];
    if (data.listings) {
      for (const [type, arr] of Object.entries(data.listings)) {
        if (Array.isArray(arr)) {
          arr.forEach((item) => items.push({ ...item, _type: type }));
        }
      }
    }
    return {
      ...data.contributor,
      totalListings: data.totalListings || items.length,
      items,
    };
  });
}

async function getListings() {
  return dedupe('listings', async () => {
    const data = unwrap(await client.get('/admin/listings'));
    return flattenResults(data).map(normalizeListing);
  });
}

async function getListing(type, id) {
  return dedupe(`listing:${type}:${id}`, async () => {
    const data = unwrap(
      await client.get(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`),
    );
    const item = data?.item;
    return item ? normalizeListing(item) : null;
  });
}

async function getCategories() {
  const stats = await getStats();
  const byType = stats?.byCategory || {};
  return CATEGORIES.map((category) => {
    const catStats = byType[category.id] || byType[listingType(category.id)] || {};
    return {
      id: category.id,
      ...category,
      total: catStats.total || 0,
      pending: catStats.pending || 0,
      approved: catStats.approved || 0,
      changesRequired: catStats['changes-required'] || 0,
      cancelled: catStats.cancelled || 0,
    };
  });
}

async function getActivity() {
  return dedupe('activity', async () => {
    const items = await getListings();
    return items
      .map((item) => ({
        _id: item._id,
        _type: item._type,
        title: item.title || item.name || 'Untitled',
        status: item.status,
        contributorName: item.lister?.name || 'Unknown',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  });
}

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
    'stats',
  ].forEach((key) => cache.remove(ns, key));
  cache.removeByPrefix(ns, 'listing:');
  cache.removeByPrefix(ns, 'contributor:');
}

async function approveListing(type, id) {
  const item = unwrap(
    await client.patch(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/approve`),
  );
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function requestChanges(type, id, reason) {
  const item = unwrap(
    await client.patch(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/changes`, { reason }),
  );
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function cancelListing(type, id, reason) {
  const item = unwrap(
    await client.patch(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/cancel`, { reason }),
  );
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function updateListing(type, id, updates) {
  if (updates.status === 'approved') return approveListing(type, id);
  if (updates.status === 'changes-required') return requestChanges(type, id, updates.reason);
  if (updates.status === 'cancelled' || updates.status === 'rejected') return cancelListing(type, id, updates.reason);
  const item = unwrap(
    await client.put(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/status`, updates),
  );
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function deleteListing(type, id) {
  await client.delete(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`);
  invalidateDataCaches();
  return true;
}

export const adminApi = {
  getStats,
  getContributors,
  getContributorDetail,
  getListings,
  getListing,
  approveListing,
  requestChanges,
  cancelListing,
  updateListing,
  deleteListing,
  getCategories,
  getActivity,
};

export default adminApi;