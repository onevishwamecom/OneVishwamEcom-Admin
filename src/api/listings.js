import client from './client';

/**
 * PHASE 1 — ISOLATED PLACEHOLDER.
 * Reconnect later via listing APIs (listings.js) → real REST endpoints.
 */
export const propertyAPI = {
  getAll: (params) => client.get('/product/properties', { params }),
  getById: (id) => client.get(`/product/properties/${id}`),
  search: (params) => client.get('/product/properties/search', { params }),
  getFeatured: () => client.get('/product/properties/featured'),
  getLatest: (params) => client.get('/product/properties/latest', { params }),
  getByCity: (city, params) => client.get(`/product/properties/by-city/${city}`, { params }),
  getByArea: (area, params) => client.get(`/product/properties/by-area/${area}`, { params }),
  getByType: (type, params) => client.get(`/product/properties/by-type/${type}`, { params }),
  getByCategory: (category, params) => client.get(`/product/properties/by-category/${category}`, { params }),
  getSimilar: (id) => client.get(`/product/properties/similar/${id}`),
  create: (body) => client.post('/product/properties', body),
  update: (id, body) => client.put(`/product/properties/${id}`, body),
  remove: (id) => client.delete(`/product/properties/${id}`),
  toggleStatus: (id) => client.patch(`/product/properties/${id}/status`),
  uploadImages: (id, formData) => client.post(`/product/properties/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (id, imageUrl) => client.delete(`/product/properties/${id}/images`, { data: { imageUrl } }),
  getMy: () => client.get('/product/properties/my/listings'),
  submitRequirement: (body) => client.post('/product/properties/requirements', body),
  uploadBrochure: (id, formData) => client.post(`/product/properties/${id}/brochure`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const vehicleAPI = {
  getAll: (params) => client.get('/product/vehicles', { params }),
  getById: (id) => client.get(`/product/vehicles/${id}`),
  getSimilar: (id) => client.get(`/product/vehicles/similar/${id}`),
  getMy: () => client.get('/product/vehicles/my'),
  create: (body) => client.post('/product/vehicles', body),
  update: (id, body) => client.put(`/product/vehicles/${id}`, body),
  remove: (id) => client.delete(`/product/vehicles/${id}`),
  toggleStatus: (id) => client.patch(`/product/vehicles/${id}/status`),
};

export const groceryAPI = {
  getAll: (params) => client.get('/product/groceries', { params }),
  getById: (id) => client.get(`/product/groceries/${id}`),
  getMy: () => client.get('/product/groceries/my'),
  create: (body) => client.post('/product/groceries', body),
  update: (id, body) => client.put(`/product/groceries/${id}`, body),
  remove: (id) => client.delete(`/product/groceries/${id}`),
  toggleStatus: (id) => client.patch(`/product/groceries/${id}/status`),
};

export const garmentAPI = {
  getAll: (params) => client.get('/product/garments', { params }),
  getById: (id) => client.get(`/product/garments/${id}`),
  getMy: () => client.get('/product/garments/my'),
  create: (body) => client.post('/product/garments', body),
  update: (id, body) => client.put(`/product/garments/${id}`, body),
  remove: (id) => client.delete(`/product/garments/${id}`),
  toggleStatus: (id) => client.patch(`/product/garments/${id}/status`),
};

export const jewelleryAPI = {
  getAll: (params) => client.get('/product/jewellery', { params }),
  getById: (id) => client.get(`/product/jewellery/${id}`),
  getSimilar: (id) => client.get(`/product/jewellery/${id}/similar`),
  getMy: () => client.get(`/product/jewellery/my`),
  create: (body) => client.post('/product/jewellery', body),
  update: (id, body) => client.put(`/product/jewellery/${id}`, body),
  remove: (id) => client.delete(`/product/jewellery/${id}`),
  toggleStatus: (id) => client.patch(`/product/jewellery/${id}/status`),
};

export const financeAPI = {
  getAll: (params) => client.get('/product/finance', { params }),
  getById: (id) => client.get(`/product/finance/${id}`),
  getSimilar: (id) => client.get(`/product/finance/similar/${id}`),
  getMy: () => client.get('/product/finance/my'),
  create: (body) => client.post('/product/finance', body),
  update: (id, body) => client.put(`/product/finance/${id}`, body),
  remove: (id) => client.delete(`/product/finance/${id}`),
  toggleStatus: (id) => client.patch(`/product/finance/${id}/status`),
};

export const mylistingsAPI = {
  getAll: (params) => client.get('/mylistings', { params }),
};

export const uploadAPI = {
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    return client.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};