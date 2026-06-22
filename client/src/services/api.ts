import api from './http';

// Auth
export const auth = {
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload).then(r => r.data),
  register: (payload: { name: string; email: string; password: string }) => api.post('/auth/register', payload).then(r => r.data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }).then(r => r.data),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

// Products
export const products = {
  list: (params: any) => api.get('/products', { params }).then(r => r.data),
  get: (id: string) => api.get(`/products/${id}`).then(r => r.data),
  bySlug: (slug: string) => api.get(`/products/slug/${slug}`).then(r => r.data),
  featured: () => api.get('/products/featured').then(r => r.data),
};

// Categories
export const categories = {
  list: () => api.get('/categories').then(r => r.data),
};

// Banners
export const banners = {
  list: () => api.get('/banners').then(r => r.data),
};

// Cart
export const cart = {
  get: () => api.get('/cart').then(r => r.data),
  add: (productId: string, qty = 1) => api.post('/cart', { productId, qty }).then(r => r.data),
  remove: (productId: string) => api.delete(`/cart/${productId}`).then(r => r.data),
};

// Orders
export const orders = {
  create: (payload: any) => api.post('/orders', payload).then(r => r.data),
  list: () => api.get('/orders').then(r => r.data),
};

// Wishlist
export const wishlist = {
  list: () => api.get('/wishlist').then(r => r.data),
  toggle: (productId: string) => api.post('/wishlist/toggle', { productId }).then(r => r.data),
};

// Coupons
export const coupons = {
  apply: (code: string, subtotal = 0) => api.post('/coupons/apply', { code, subtotal }).then(r => r.data),
};

// Admin helpers (examples)
export const admin = {
  products: {
    create: (payload: any) => api.post('/admin/products', payload).then(r => r.data),
    update: (id: string, payload: any) => api.patch(`/admin/products/${id}`, payload).then(r => r.data),
    delete: (id: string) => api.delete(`/admin/products/${id}`).then(r => r.data),
  },
};

export default api;
