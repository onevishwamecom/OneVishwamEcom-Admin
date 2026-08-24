import { ADMIN_AUTH } from '../config/adminAuth';

const STORAGE_PREFIX = 'onevishwam_admin_listing_read_state';
const STORAGE_VERSION = 1;

function getAdminId() {
  try {
    const raw = localStorage.getItem('wvz_admin_session');
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.email) return session.email;
    }
  } catch {
    /* fall through */
  }
  return ADMIN_AUTH.email || 'default-admin';
}

export function getListingReadStorageKey() {
  return `${STORAGE_PREFIX}_${getAdminId()}`;
}

function unique(ids) {
  return [...new Set(ids)];
}

function emptyState() {
  return {
    version: STORAGE_VERSION,
    initialized: false,
    knownListingIds: [],
    readListingIds: [],
  };
}

function normalize(state) {
  if (!state || state.version !== STORAGE_VERSION) return emptyState();
  return {
    version: STORAGE_VERSION,
    initialized: Boolean(state.initialized),
    knownListingIds: Array.isArray(state.knownListingIds) ? state.knownListingIds : [],
    readListingIds: Array.isArray(state.readListingIds) ? state.readListingIds : [],
  };
}

export function loadListingReadState() {
  try {
    const raw = localStorage.getItem(getListingReadStorageKey());
    if (!raw) return emptyState();
    return normalize(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

function saveListingReadState(state) {
  try {
    localStorage.setItem(getListingReadStorageKey(), JSON.stringify(state));
  } catch {
    /* storage unavailable — keep in-memory state only */
  }
}

function listingIdOf(listing) {
  return listing?._id || listing?.id || null;
}

/**
 * Establish the baseline on first run and detect newly added listings on later
 * runs. Existing (baseline) listings are treated as already read so they never
 * suddenly appear as NEW. Stale ids (listings removed from the source) are
 * pruned. Storage is only touched here — never per render.
 *
 * Returns { state, newIds } where newIds are listings seen for the first time.
 */
export function initListingReadState(listings) {
  const currentIds = unique((listings || []).map(listingIdOf).filter(Boolean));
  if (currentIds.length === 0) return { state: loadListingReadState(), newIds: [] };

  const prev = normalize(loadListingReadState());

  if (!prev.initialized) {
    const state = {
      ...prev,
      initialized: true,
      knownListingIds: currentIds,
      readListingIds: unique([...currentIds, ...prev.readListingIds]),
    };
    saveListingReadState(state);
    return { state, newIds: [] };
  }

  const knownSet = new Set(prev.knownListingIds);
  const newIds = currentIds.filter((id) => !knownSet.has(id));
  const currentSet = new Set(currentIds);

  const state = {
    ...prev,
    knownListingIds: currentIds,
    readListingIds: unique(prev.readListingIds.filter((id) => currentSet.has(id))),
  };
  saveListingReadState(state);
  return { state, newIds };
}

export function markListingRead(id) {
  if (!id) return loadListingReadState();
  const state = normalize(loadListingReadState());
  const next = {
    ...state,
    readListingIds: unique([...state.readListingIds, id]),
  };
  saveListingReadState(next);
  return next;
}