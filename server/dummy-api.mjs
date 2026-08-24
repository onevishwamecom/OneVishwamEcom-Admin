import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');
const PORT = process.env.PORT || 5002;

const TYPE_LABELS = {
  builder: 'Builder',
  vendor: 'Vendor',
  individual: 'Individual',
  service: 'Service Provider',
};

const CATEGORY_TO_TYPE = {
  'real-estate': 'properties',
  vehicle: 'vehicles',
  grocery: 'groceries',
  garment: 'garments',
  jewellery: 'jewellery',
  finance: 'finance',
  service: 'services',
  properties: 'properties',
  vehicles: 'vehicles',
  groceries: 'groceries',
  garments: 'garments',
  services: 'services',
};

let db = null;

function emptyDB() {
  return { listings: {}, contributors: [], activity: [] };
}

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('[dummy-api] Failed to read db.json:', err.message);
  }
  if (!db || !db.listings || !db.contributors) {
    db = emptyDB();
    console.warn(
      '[dummy-api] db.json not found — starting with an empty store. ' +
        'Add listings via POST /api/listings or seed db.json directly.',
    );
    persist();
  }
}

function persist() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('[dummy-api] Failed to persist db.json:', err.message);
  }
}

function flattenListings() {
  return Object.entries(db.listings).flatMap(([type, items]) =>
    (items || []).map((item) => ({ ...item, _type: type })),
  );
}

function deriveContributorStats() {
  const acc = {};
  for (const item of flattenListings()) {
    if (!item.contributorId) continue;
    const stats = (acc[item.contributorId] ||= {
      totalListings: 0,
      approvedListings: 0,
      pendingListings: 0,
      changesRequired: 0,
      cancelledListings: 0,
    });
    stats.totalListings += 1;
    if (item.status === 'approved') stats.approvedListings += 1;
    else if (item.status === 'pending') stats.pendingListings += 1;
    else if (item.status === 'changes-required') stats.changesRequired += 1;
    else if (item.status === 'cancelled') stats.cancelledListings += 1;
  }
  return acc;
}

function getContributors() {
  const stats = deriveContributorStats();
  return db.contributors.map((c) => ({
    ...c,
    typeLabel: TYPE_LABELS[c.type] || c.type || 'Contributor',
    ...(stats[c.id] || {
      totalListings: 0,
      approvedListings: 0,
      pendingListings: 0,
      changesRequired: 0,
      cancelledListings: 0,
    }),
  }));
}

function getAdminStats() {
  const all = flattenListings();
  const count = (s) => all.filter((i) => i.status === s).length;
  return {
    totalListings: all.length,
    pendingListings: count('pending'),
    approvedListings: count('approved'),
    changesRequired: count('changes-required'),
    cancelledListings: count('cancelled'),
    totalContributors: db.contributors.length,
  };
}

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function makeId(type) {
  return `mock-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function resolveContributor(input) {
  if (!input) return null;
  if (input.id) {
    const existing = db.contributors.find((c) => c.id === input.id);
    if (existing) return existing;
  }
  const email = String(input.email || '').trim().toLowerCase();
  if (email) {
    const existing = db.contributors.find((c) => String(c.email || '').trim().toLowerCase() === email);
    if (existing) return existing;
  }
  const name = String(input.name || '').trim();
  if (name) {
    const existing = db.contributors.find((c) => String(c.name || '').trim().toLowerCase() === name.toLowerCase());
    if (existing) return existing;
  }
  const contributor = {
    id: input.id || `contributor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: name || input.fullName || 'Unknown Vendor',
    type: input.type || input.role || 'vendor',
    contact: input.contact || input.mobile || '',
    email: input.email || '',
    city: input.city || 'Bengaluru',
    createdAt: new Date().toISOString(),
  };
  db.contributors.push(contributor);
  return contributor;
}

function createListing(payload) {
  const type = CATEGORY_TO_TYPE[payload.category] || payload.category || 'properties';
  const timestamp = new Date().toISOString();
  const contributor = resolveContributor(payload.contributor);
  const listing = {
    _id: payload._id || payload.listingId || makeId(type),
    title: payload.title || payload.name || 'Untitled Listing',
    subtitle: payload.subtitle || '',
    description: payload.description || '',
    price: payload.price ?? '',
    priceSuffix: payload.priceSuffix || '',
    category: payload.category || '',
    subcategory: payload.subcategory || '',
    city: payload.city || '',
    area: payload.area || '',
    pincode: payload.pincode || '',
    contact: payload.contact || (contributor && contributor.contact) || '',
    location: payload.location || (payload.area ? `${payload.area}, ${payload.city || 'Bengaluru'}` : ''),
    images: Array.isArray(payload.images) ? payload.images : [],
    documents: Array.isArray(payload.documents) ? payload.documents : [],
    brochure: payload.brochure || '',
    status: 'pending',
    adminComment: '',
    contributorId: contributor ? contributor.id : null,
    createdAt: payload.createdAt || timestamp,
    updatedAt: timestamp,
  };
  for (const [key, value] of Object.entries(payload)) {
    if (!(key in listing)) listing[key] = value;
  }
  if (!db.listings[type]) db.listings[type] = [];
  db.listings[type].push(listing);
  if (contributor) {
    db.activity.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action: 'submitted',
      listingTitle: listing.title,
      contributorName: contributor.name,
      note: 'New listing submitted and queued for review.',
      createdAt: timestamp,
    });
  }
  persist();
  return { listing, type };
}

function getListing(type, id) {
  const items = db.listings[type] || [];
  return items.find((it) => (it._id || it.id) === id) || null;
}

function logActivity({ action, listingTitle, contributorId, note }) {
  const contributor = db.contributors.find((c) => c.id === contributorId);
  db.activity = db.activity || [];
  db.activity.unshift({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    listingTitle: listingTitle || 'Unknown listing',
    contributorName: contributor ? contributor.name : 'Unknown contributor',
    note: note || '',
    createdAt: new Date().toISOString(),
  });
}

function updateListing(type, id, updates) {
  const items = db.listings[type] || [];
  const idx = items.findIndex((it) => (it._id || it.id) === id);
  if (idx === -1) return null;
  const merged = {
    ...items[idx],
    ...Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined && v !== null)),
    updatedAt: new Date().toISOString(),
  };
  items[idx] = merged;
  if (merged.status === 'approved') {
    logActivity({ action: 'approved', listingTitle: merged.title, contributorId: merged.contributorId, note: merged.adminComment || 'Approved from review queue.' });
  } else if (merged.status === 'changes-required') {
    logActivity({ action: 'changes-requested', listingTitle: merged.title, contributorId: merged.contributorId, note: merged.adminComment || 'Changes requested.' });
  } else if (merged.status === 'cancelled') {
    logActivity({ action: 'cancelled', listingTitle: merged.title, contributorId: merged.contributorId, note: merged.adminComment || 'Listing cancelled.' });
  } else if (updates.title || updates.price !== undefined || updates.images !== undefined) {
    logActivity({ action: 'updated', listingTitle: merged.title, contributorId: merged.contributorId, note: 'Listing information updated.' });
  }
  persist();
  return merged;
}

function removeListing(type, id) {
  const items = db.listings[type] || [];
  const idx = items.findIndex((it) => (it._id || it.id) === id);
  if (idx === -1) return null;
  const [removed] = items.splice(idx, 1);
  persist();
  return removed;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  if (pathname === '/api/health' && method === 'GET') {
    return send(res, 200, { success: true, message: 'Dummy API is running' });
  }

  if (pathname === '/api/listings' && method === 'GET') {
    const flatten = url.searchParams.get('flatten') === '1';
    return send(res, 200, { success: true, data: flatten ? flattenListings() : db.listings });
  }

  if (pathname === '/api/listings' && method === 'POST') {
    try {
      const body = await readBody(req);
      const result = createListing(body);
      return send(res, 201, { success: true, data: { ...result.listing, _type: result.type } });
    } catch (err) {
      return send(res, 400, { success: false, message: 'Invalid JSON body' });
    }
  }

  if (pathname === '/api/admin/stats' && method === 'GET') {
    return send(res, 200, { success: true, data: getAdminStats() });
  }

  if (pathname === '/api/contributors' && method === 'GET') {
    return send(res, 200, { success: true, data: getContributors() });
  }

  const contributorMatch = pathname.match(/^\/api\/contributors\/([^/]+)$/);
  if (contributorMatch && method === 'GET') {
    const id = decodeURIComponent(contributorMatch[1]);
    const contributor = db.contributors.find((c) => c.id === id);
    if (!contributor) {
      return send(res, 404, { success: false, message: 'Contributor not found' });
    }
    const items = flattenListings().filter((l) => l.contributorId === id);
    const stats = deriveContributorStats()[id] || {
      totalListings: 0,
      approvedListings: 0,
      pendingListings: 0,
      changesRequired: 0,
      cancelledListings: 0,
    };
    return send(res, 200, {
      success: true,
      data: {
        contributor: { ...contributor, typeLabel: TYPE_LABELS[contributor.type] || contributor.type || 'Contributor' },
        stats,
        items,
      },
    });
  }

  const listingMatch = pathname.match(/^\/api\/listings\/([^/]+)\/([^/]+)$/);
  if (listingMatch) {
    const [, type, id] = listingMatch;
    const decodedId = decodeURIComponent(id);
    if (method === 'GET') {
      const listing = getListing(type, decodedId);
      if (!listing) return send(res, 404, { success: false, message: 'Listing not found' });
      return send(res, 200, { success: true, data: { ...listing, _type: type } });
    }
    if (method === 'PATCH') {
      try {
        const body = await readBody(req);
        const updated = updateListing(type, decodedId, body);
        if (!updated) return send(res, 404, { success: false, message: 'Listing not found' });
        return send(res, 200, { success: true, data: { ...updated, _type: type } });
      } catch (err) {
        return send(res, 400, { success: false, message: 'Invalid JSON body' });
      }
    }
    if (method === 'DELETE') {
      const removed = removeListing(type, decodedId);
      if (!removed) return send(res, 404, { success: false, message: 'Listing not found' });
      return send(res, 200, { success: true, data: removed });
    }
  }

  if (pathname === '/api/activity' && method === 'GET') {
    const items = [...(db.activity || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return send(res, 200, { success: true, data: items });
  }

  return send(res, 404, { success: false, message: 'Route not found' });
});

loadDB();
server.listen(PORT, () => {
  console.log(`[dummy-api] OneVishwam dummy server running on http://localhost:${PORT}`);
});