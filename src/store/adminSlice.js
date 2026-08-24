import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { ADMIN_AUTH } from '../config/adminAuth';
import cache, { adminNamespace } from '../services/cache/cacheService';

/**
 * PHASE 1 — PROTOTYPE ADMIN SESSION (FRONTEND-ONLY).
 * ============================================================================
 * Temporary admin authentication. A single administrator is configured in
 * `src/config/adminAuth.js`.
 *
 * TODO:
 * Replace prototype authentication with secure backend authentication before
 * production. When the backend exists this slice should call:
 *     POST /admin/auth/login    (via the isolated `src/api` layer)
 * and validate the returned JWT / session server-side.
 * ============================================================================
 */

const SESSION_KEY = 'wvz_admin_session';

function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
}

export const adminLoginUser = createAsyncThunk(
  'admin/login',
  async ({ email, password }, { rejectWithValue }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (normalizedEmail !== ADMIN_AUTH.email) {
      return rejectWithValue('Invalid administrator credentials');
    }
    if (
      typeof password !== 'string' ||
      password.length < ADMIN_AUTH.minPasswordLength ||
      password !== ADMIN_AUTH.password
    ) {
      return rejectWithValue('Invalid administrator credentials');
    }

    const session = {
      email: ADMIN_AUTH.email,
      name: ADMIN_AUTH.displayName,
      role: 'admin',
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },
);

const storedSession = readStoredSession();

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    isAdminLoggedIn: !!storedSession,
    admin: storedSession,
    loading: false,
    error: null,
  },
  reducers: {
    adminLogout(state) {
      state.isAdminLoggedIn = false;
      state.admin = null;
      state.error = null;
      clearStoredSession();
      cache.clearNamespace(adminNamespace());
    },
    adminClearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdminLoggedIn = true;
        state.admin = action.payload;
      })
      .addCase(adminLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout, adminClearError } = adminSlice.actions;
export default adminSlice.reducer;

export function useAdminAuth() {
  const dispatch = useDispatch();
  return {
    isAdminLoggedIn: useSelector((s) => s.admin.isAdminLoggedIn),
    admin: useSelector((s) => s.admin.admin),
    loading: useSelector((s) => s.admin.loading),
    error: useSelector((s) => s.admin.error),
    login: (credentials) => dispatch(adminLoginUser(credentials)),
    logout: () => dispatch(adminLogout()),
    clearError: () => dispatch(adminClearError()),
  };
}