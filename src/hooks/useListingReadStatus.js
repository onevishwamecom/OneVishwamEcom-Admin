import { useCallback, useEffect, useState } from 'react';
import {
  getListingReadStorageKey,
  initListingReadState,
  loadListingReadState,
  markListingRead,
} from '../utils/listingReadState';

/**
 * Tracks which admin listings the current admin has not yet opened.
 * - Baseline: on first load, existing listings are considered read (no NEW).
 * - Listings that appear later are UNSEEN until the admin opens their detail
 *   page (markAsRead), after which the badge stays cleared across refreshes.
 * - State persists in localStorage (namespaced by admin) and stays in memory
 *   afterwards; storage is only written on init / mark-as-read.
 * - Syncs across tabs via the `storage` event.
 */
export default function useListingReadStatus() {
  const [readIds, setReadIds] = useState(() => loadListingReadState().readListingIds);
  const [knownIds, setKnownIds] = useState(() => loadListingReadState().knownListingIds);

  const initializeListings = useCallback((listings) => {
    const { state, newIds } = initListingReadState(listings);
    setKnownIds(state.knownListingIds);
    setReadIds(state.readListingIds);
    return newIds;
  }, []);

  const markAsRead = useCallback((id) => {
    if (!id) return;
    const next = markListingRead(id);
    setReadIds(next.readListingIds);
  }, []);

  const isUnseen = useCallback(
    (id) => Boolean(id) && knownIds.includes(id) && !readIds.includes(id),
    [knownIds, readIds],
  );

  const unseenCount = knownIds.reduce((count, id) => (readIds.includes(id) ? count : count + 1), 0);

  useEffect(() => {
    const storageKey = getListingReadStorageKey();
    const onStorage = (event) => {
      if (event.key !== storageKey) return;
      const state = loadListingReadState();
      setKnownIds(state.knownListingIds);
      setReadIds(state.readListingIds);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { unseenCount, isUnseen, markAsRead, initializeListings };
}