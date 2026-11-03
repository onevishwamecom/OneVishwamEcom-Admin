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
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Try direct Backend Admin API /admin/auth/login
    try {
      const { data } = await client.post('/admin/auth/login', { email: cleanEmail, password });
      if (data?.data?.accessToken) {
        const { accessToken, refreshToken, admin: adminData } = data.data;
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        const session = {
          id: adminData?.id || adminData?._id,
          email: adminData?.email || cleanEmail,
          displayName: adminData?.name || adminData?.fullName || 'Super Admin',
          role: adminData?.role || 'super-admin',
          loggedInAt: new Date().toISOString(),
        };
        writeStoredSession(session);
        return session;
      }
    } catch (apiErr) {
      console.warn('[Admin API Auth] Direct backend login attempt failed, trying Firebase Auth:', apiErr.response?.data || apiErr.message);
    }

    // 2. Fallback to Firebase Auth
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const idToken = await result.user.getIdToken(true);
      if (!idToken) {
        throw new Error('No ID token received from Firebase Auth');
      }
      localStorage.setItem('accessToken', idToken);
      localStorage.removeItem('refreshToken');
      const session = {
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || 'Super Admin',
        role: 'super-admin',
        loggedInAt: new Date().toISOString(),
      };
      writeStoredSession(session);
      return session;
    } catch (firebaseErr) {
      let message = 'Invalid admin credentials';
      if (firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (firebaseErr.message) {
        message = firebaseErr.message;
      }
      return rejectWithValue(message);
    }
  },
);

export const adminFetchMe = createAsyncThunk(
  'admin/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/admin/auth/me');
      return data.data?.admin || data.data;
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