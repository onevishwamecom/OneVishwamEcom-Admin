import client from './client';

function unwrap(response) {
  const body = response?.data;
  return body && body.success !== undefined ? body.data : body;
}

export async function fetchAdminAnnouncements(params = {}) {
  const res = await client.get('/announcements/admin', { params });
  return unwrap(res);
}

export async function createAnnouncement(payload) {
  const res = await client.post('/announcements/admin', payload);
  return unwrap(res);
}

export async function updateAnnouncement(id, payload) {
  const res = await client.put(`/announcements/admin/${id}`, payload);
  return unwrap(res);
}

export async function toggleAnnouncement(id) {
  const res = await client.patch(`/announcements/admin/${id}/toggle`);
  return unwrap(res);
}

export async function deleteAnnouncement(id) {
  const res = await client.delete(`/announcements/admin/${id}`);
  return unwrap(res);
}

export async function simulateProductAddition(category = 'properties', count = 3) {
  const res = await client.post('/announcements/admin/simulate-addition', { category, count });
  return unwrap(res);
}

