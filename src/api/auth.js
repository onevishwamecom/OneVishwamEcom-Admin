import client from './client';

/**
 * PHASE 1 — ISOLATED PLACEHOLDER.
 * Reconnect later via `authAPI.login(...)` → `POST /auth/login`.
 */
export const authAPI = {
  login: (body) => client.post('/auth/login', body),
  register: (body) => client.post('/auth/register', body),
  refresh: (refreshToken) => client.post('/auth/refresh', { refreshToken }),
  getMe: () => client.get('/auth/me'),
  updateProfile: (body) => client.put('/auth/profile', body),
  changePassword: (body) => client.put('/auth/password', body),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  verifyOtp: (body) => client.post('/auth/verify-otp', body),
  resendOtp: (email) => client.post('/auth/resend-otp', { email }),
  resetPasswordWithOtp: (body) => client.post('/auth/reset-password', body),
  deleteAccount: () => client.delete('/auth/account'),
  logout: () => client.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }),
  toggleSave: (listingId) => client.post('/auth/save', { listingId }),
  getSaved: () => client.get('/auth/saved'),
};

export const publicAPI = {
  getLoans: (params) => client.get('/loans', { params }),
  sendEnquiry: (body) => client.post('/enquiries', body),
  submitReview: (body) => client.post('/reviews', body),
  getUserReviews: (userId) => client.get(`/users/${userId}/reviews`),
};