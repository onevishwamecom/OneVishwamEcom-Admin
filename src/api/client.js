import axios from 'axios';
import { auth } from '../firebase/config';

/**
 * ============================================================================
 * PHASE 1 — FRONTEND-ONLY PROTOTYPE (API LAYER ISOLATED)
 * ============================================================================
 * These API modules are kept as FUTURE INTEGRATION PLACEHOLDERS for Step 2
 * (Backend Architecture). Nothing in the application imports this layer during
 * Phase 1, so the frontend runs entirely on local mock data.
 *
 * Do NOT import from this directory in component/page code.
 * When the backend exists, wire `src/mock` getters to real API calls via a
 * dedicated data-access layer (see PART S of the project plan).
 * ============================================================================
 */

const client = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'https://asia-south1-onevishwam.cloudfunctions.net/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status >= 200 && status < 300,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  config.headers['X-Requested-With'] = 'XMLHttpRequest';

  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (auth?.currentUser) {
        try {
          const newAccess = await auth.currentUser.getIdToken(true);
          localStorage.setItem('accessToken', newAccess);
          processQueue(null, newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return client(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          clearAuthData();
          window.dispatchEvent(new Event('auth:logout'));
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuthData();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(
          `${client.defaults.baseURL}/admin/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccess = data.data?.accessToken;
        const newRefresh = data.data?.refreshToken;

        if (!newAccess) {
          throw new Error('Token refresh failed: no access token returned');
        }

        localStorage.setItem('accessToken', newAccess);
        if (newRefresh) {
          localStorage.setItem('refreshToken', newRefresh);
        }

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return client(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuthData();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

function clearAuthData() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export { clearAuthData };
export default client;