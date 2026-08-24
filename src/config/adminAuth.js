/**
 * PHASE 1 — PROTOTYPE ADMIN AUTHENTICATION CONFIGURATION (DEV ONLY).
 * ============================================================================
 * Single prototype administrator for the frontend-only admin console.
 *
 * TODO:
 * Replace prototype authentication with secure backend authentication before
 * production. When the backend exists this should become:
 *     POST /admin/auth/login   →  { accessToken, admin }
 * with server-side credential verification.
 *
 * The password below is a LOCAL-ONLY developer credential for this prototype
 * (no real secret). It must be removed when a backend is introduced.
 * ============================================================================
 */
export const ADMIN_AUTH = {
  email: 'admin@onevishwam.com',
  displayName: 'Admin',
  minPasswordLength: 8,
  password: 'Admin@789',
};

export default ADMIN_AUTH;