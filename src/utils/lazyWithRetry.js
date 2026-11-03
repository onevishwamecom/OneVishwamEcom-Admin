import { lazy } from 'react';

/**
 * Enhanced React.lazy with automatic chunk mismatch recovery.
 * When a new deployment invalidates old chunk hashes, this helper
 * reloads the page once to retrieve the latest HTML and bundles.
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const reloadKey = 'admin_chunk_reload_lock';
    const hasReloaded = JSON.parse(sessionStorage.getItem(reloadKey) || 'false');

    try {
      const component = await componentImport();
      sessionStorage.setItem(reloadKey, 'false');
      return component;
    } catch (error) {
      console.warn('[lazyWithRetry] Dynamic import failed, checking reload policy:', error?.message);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
        // Return an unresolved promise to prevent ErrorBoundary flash while page reloads
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

export default lazyWithRetry;

