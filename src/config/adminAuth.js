/**
 * Admin authentication configuration.
 * The actual credential verification is now handled by Firebase Auth.
 * The values below are used for pre-filling the login form and
 * for the pre-configured password that Firebase will authenticate against.
 */
export const ADMIN_AUTH = {
  email: 'admin@onevishwam.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'defaultAdminPass123!',
  displayName: 'Admin',
  minPasswordLength: 8,
};

export default ADMIN_AUTH;