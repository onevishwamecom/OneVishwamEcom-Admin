import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import client from '../api/client';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import cache, { adminNamespace } from '../services/cache/cacheService';

const SESSION_KEY = 'wvz_admin_session';

function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export const adminLoginUser = createAsyncThunk(
  'admin/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = result.user.uid ? await result.user.getIdToken() : result.user.stsTokenManager?.token;
      if (!idToken) {
        throw new Error('No ID token received from Firebase Auth');
      }
      console.log('🔑 [ADMIN ID TOKEN]:', idToken);
      localStorage.setItem('accessToken', idToken);
      localStorage.removeItem('refreshToken');
      const decoded = JSON.parse(atob(idToken.split('.')[1]));
      const session = {
        id: decoded.sub || decoded.user_id,
        email: result.user.email,
        displayName: result.user.displayName,
        loggedInAt: new Date().toISOString(),
      };
      writeStoredSession(session);
      return session;
    } catch (err) {
      return rejectWithValue(err.message || 'Invalid admin credentials');
    }
  },
);

export const adminFetchMe = createAsyncThunk(
  'admin/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/admin/auth/me');
      return data.data.admin;
    } catch (err) {
      if (err.response?.status === 401) {
        const token = localStorage.getItem('accessToken');
        if (token) return rejectWithValue('TOKEN_EXPIRED');
      }
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  },
);

export const adminLogoutAction = createAction('admin/forceLogout');

const storedSession = readStoredSession();

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    isAdminLoggedIn: Boolean(storedSession && localStorage.getItem('accessToken')),
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
      })
      .addCase(adminFetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminFetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = { ...state.admin, ...action.payload };
        state.isAdminLoggedIn = true;
        writeStoredSession({ ...state.admin, ...action.payload });
      })
      .addCase(adminFetchMe.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === 'TOKEN_EXPIRED') {
          state.error = null;
        } else {
          state.error = action.payload;
        }
        if (!localStorage.getItem('accessToken')) {
          state.isAdminLoggedIn = false;
          state.admin = null;
          clearStoredSession();
        }
      })
      .addCase(adminLogoutAction, (state) => {
        state.isAdminLoggedIn = false;
        state.admin = null;
        state.error = null;
        clearStoredSession();
        cache.clearNamespace(adminNamespace());
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
    fetchMe: () => dispatch(adminFetchMe()),
    clearError: () => dispatch(adminClearError()),
  };
}