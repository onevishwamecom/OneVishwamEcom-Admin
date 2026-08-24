/**
 * PHASE 1 — ISOLATED API PLACEHOLDERS
 * ============================================================================
 * The frontend is currently 100% mock-data driven and must NOT import this
 * directory (see PART A / PART R of the project plan).
 *
 * Step 2 will introduce the backend; Step 3 will replace the `src/mock`
 * data-access functions (getMockListings, getMockContributors, ...) with the
 * real callers defined here WITHOUT rewriting the UI.
 * ============================================================================
 */

export { default as client, clearAuthData } from './client';
export { authAPI, publicAPI } from './auth';
export {
  propertyAPI,
  vehicleAPI,
  groceryAPI,
  garmentAPI,
  jewelleryAPI,
  financeAPI,
  mylistingsAPI,
  uploadAPI,
} from './listings';