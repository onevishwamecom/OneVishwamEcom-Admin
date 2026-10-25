import client from './client';
import cache, { adminNamespace, clearInflight } from '../services/cache/cacheService';
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
    properties: 'properties',
    vehicle: 'vehicles',
    vehicles: 'vehicles',
    automobile: 'vehicles',
    automobiles: 'vehicles',
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
  return dedupe('stats', async () => {
    const raw = await client.get('/admin/listings/stats').then(unwrap).catch(() => null);
    const data = raw || {};
    const total = Number(data.totalListings ?? data.total ?? 0);
    const pending = Number(data.pendingListings ?? data.pending ?? 0);
    const approved = Number(data.approvedListings ?? data.approved ?? 0);
    const cancelled = Number(data.cancelledListings ?? data.cancelled ?? 0);
    const changesRequired = Number(data.changesRequiredListings ?? data['changes-required'] ?? 0);

    return {
      ...data,
      total,
      totalListings: total,
      pending,
      pendingListings: pending,
      approved,
      approvedListings: approved,
      cancelled,
      cancelledListings: cancelled,
      'changes-required': changesRequired,
      changesRequiredListings: changesRequired,
      userStats: data.userStats || {
        totalUsers: 0,
        loggedInUsers: 0,
        activeUsers: 0,
        emailVerifiedUsers: 0,
      },
      visitorStats: data.visitorStats || null,
    };
  });
}

async function getVisitorStats() {
  return dedupe('visitorStats', () =>
    client
      .get('/visitors/count')
      .then(unwrap)
      .catch(() => null)
  );
}

async function getContributors() {
  return dedupe('contributors', () =>
    client.get('/admin/contributors').then(unwrap).then((data) => {
      const list = data?.contributors || [];
      const seen = new Set();
      const unique = [];
      for (const c of list) {
        const key = (c.email || c.name || String(c._id || c.id || '')).trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        unique.push(c);
      }
      return unique;
    }),
  );
}

async function getContributorDetail(id) {
  if (!id) return null;
  return dedupe(`contributor:${id}`, async () => {
    let data = null;
    try {
      data = unwrap(await client.get(`/admin/contributors/${encodeURIComponent(id)}`));
    } catch {}

    const items = [];
    if (data?.listings) {
      for (const [type, arr] of Object.entries(data.listings)) {
        if (Array.isArray(arr)) {
          arr.forEach((item) => items.push({ ...item, _type: type }));
        }
      }
    }

    // Resilient fallback if endpoint returned 0 items or needs contributor info
    let contributorObj = data?.contributor;
    if (!contributorObj || !contributorObj.name) {
      try {
        const allContribs = await getContributors();
        const found = allContribs.find(
          (c) => String(c._id || c.id) === String(id) || (c.email && c.email.toLowerCase() === String(id).toLowerCase())
        );
        if (found) {
          contributorObj = { ...found, ...(contributorObj || {}) };
        }
      } catch {}
    }
    contributorObj = contributorObj || {};

    if (items.length === 0) {
      try {
        const allListings = await getListings();
        const targetId = String(id || '');
        const contributorEmail = (contributorObj?.email || (targetId.includes('@') ? targetId : '')).toLowerCase();

        const matched = allListings.filter((l) => {
          const listerId = String(l.lister?._id || l.listerId || l.createdBy || l.contributorId || '');
          const listerEmail = (l.lister?.email || l.contributor?.email || l.contactEmail || '').toLowerCase();
          const contributorId = String(l.contributor?._id || l.contributor?.id || '');

          return (
            (targetId && (listerId === targetId || contributorId === targetId)) ||
            (contributorObj?._id && (listerId === String(contributorObj._id) || contributorId === String(contributorObj._id))) ||
            (contributorEmail && (listerEmail === contributorEmail || (l.contactEmail && l.contactEmail.toLowerCase() === contributorEmail)))
          );
        });

        if (matched.length > 0) {
          items.push(...matched);
        }
      } catch {}
    }

    const phone = contributorObj.phone || contributorObj.contact || (items[0]?.contributor?.contact || items[0]?.contributor?.phone || items[0]?.contact || '');
    const email = contributorObj.email || (items[0]?.contributor?.email || (id.includes('@') ? id : ''));
    const name = contributorObj.name || (items[0]?.contributor?.name || items[0]?.lister?.name) || 'Contributor';

    return {
      ...contributorObj,
      _id: contributorObj._id || id,
      id: contributorObj._id || id,
      name,
      phone,
      contact: phone,
      email,
      totalListings: items.length || data?.totalListings || 0,
      items,
      stats: {
        totalListings: items.length,
        approvedListings: items.filter((i) => i.status === 'approved').length,
        pendingListings: items.filter((i) => i.status === 'pending').length,
        cancelledListings: items.filter((i) => i.status === 'cancelled').length,
      },
    };
  });
}

async function getListings() {
  return dedupe('listings', async () => {
    const data = unwrap(await client.get('/admin/listings?limit=500'));
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
        title: item.title || 'Untitled',
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
    'userStats',
  ].forEach((key) => cache.remove(ns, key));
  cache.removeByPrefix(ns, 'listing:');
  cache.removeByPrefix(ns, 'contributor:');
  cache.removeByPrefix(ns, 'users:');
  // Clear in-flight promises to prevent stale data on immediate refetch
  clearInflight();
  inFlight.clear();
  try {
    localStorage.setItem('admin_listings_updated', String(Date.now()));
  } catch (e) {}
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
  let item = null;
  try {
    // Primary /listings/:type/:id endpoint
    item = unwrap(
      await client.patch(`/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, updates),
    );
  } catch (err) {
    try {
      item = unwrap(
        await client.put(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, updates),
      );
    } catch {
      item = unwrap(
        await client.patch(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, updates),
      );
    }
  }
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function reorderListingImages(type, id, images) {
  const payload = Array.isArray(images) ? { images } : images;
  const url = type
    ? `/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/images/reorder`
    : `/admin/products/${encodeURIComponent(id)}/images/reorder`;
  const item = unwrap(await client.patch(url, payload));
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function deleteListing(type, id) {
  await client.delete(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}`);
  invalidateDataCaches();
  return true;
}

async function updateAvailabilityStatus(type, id, availabilityStatus) {
  const item = unwrap(
    await client.patch(`/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/availability`, { availabilityStatus }),
  );
  invalidateDataCaches();
  return item?.item ? normalizeListing(item.item) : null;
}

async function getUserStats() {
  return dedupe('userStats', () => client.get('/admin/users/stats').then(unwrap));
}

async function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const key = `users:${query}`;
  return dedupe(key, () => client.get(`/admin/users?${query}`).then(unwrap));
}

async function getUserActivity(id) {
  if (!id) return null;
  return dedupe(`userActivity:${id}`, () =>
    client.get(`/admin/users/${encodeURIComponent(id)}/activity`).then(unwrap)
  );
}

async function getBulkBatches(params = {}) {
  return client.get('/bulk-listing/batches', { params }).then(unwrap);
}

async function getBulkBatchById(batchId) {
  return client.get(`/bulk-listing/batches/${encodeURIComponent(batchId)}`).then(unwrap);
}

async function getTemplateDownloadLogs(params = {}) {
  return client.get('/bulk-listing/download-logs', { params }).then(unwrap);
}

async function deleteBatch(batchId) {
  return client.delete(`/bulk-listing/batches/${encodeURIComponent(batchId)}`).then(unwrap);
}

async function deleteBatchItem(batchId, itemId) {
  return client.delete(`/bulk-listing/batches/${encodeURIComponent(batchId)}/items/${encodeURIComponent(itemId)}`).then(unwrap);
}

async function updateBatchItem(batchId, itemId, data) {
  return client.put(`/bulk-listing/batches/${encodeURIComponent(batchId)}/items/${encodeURIComponent(itemId)}`, data).then(unwrap);
}

async function addItemToBatch(batchId, data) {
  return client.post(`/bulk-listing/batches/${encodeURIComponent(batchId)}/items`, data).then(unwrap);
}

export const adminApi = {
  getStats,
  getVisitorStats,
  getContributors,
  getContributorDetail,
  getListings,
  getListing,
  getUserStats,
  getUsers,
  getUserActivity,
  approveListing,
  requestChanges,
  cancelListing,
  updateListing,
  reorderListingImages,
  updateAvailabilityStatus,
  deleteListing,
  getCategories,
  getActivity,
  getBulkBatches,
  getBulkBatchById,
  getTemplateDownloadLogs,
  deleteBatch,
  deleteBatchItem,
  updateBatchItem,
  addItemToBatch,
};

export default adminApi;