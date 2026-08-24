/**
 * Admin authentication configuration.
 * The actual credential verification is now handled by the backend:
 *     POST /api/admin/auth/login
 *
 * The values below are used only for pre-filling the login form email field
 * in development. The password is never stored in frontend code.
 */
export const ADMIN_AUTH = {
  email: 'admin@onevishwam.com',
  displayName: 'Admin',
  minPasswordLength: 8,
};

export default ADMIN_AUTH;