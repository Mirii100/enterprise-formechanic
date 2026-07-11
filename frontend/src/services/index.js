import api from './api';

export const getCategories = () => api.get('/categories/');
export const getBrands = () => api.get('/brands/');
export const getProducts = (params) => api.get('/products/', { params });
export const getProduct = (slug) => api.get(`/products/${slug}/`);
export const getFeaturedProducts = () => api.get('/featured/');
export const searchSuggestions = (q) => api.get('/suggestions/', { params: { q } });
export const getVehicleHierarchy = () => api.get('/vehicles/');
export const registerUser = (data) => api.post('/auth/register/', data);
export const getMe = () => api.get('/auth/me/');
export const logoutUser = () => api.post('/auth/logout/', {});

export const getCart = () => api.get('/orders/cart/');
export const addToCart = (product_id, quantity = 1) =>
  api.post('/orders/cart/add/', { product_id, quantity });
export const updateCartItem = (item_id, quantity) =>
  api.put(`/orders/cart/items/${item_id}/`, { quantity });
export const removeCartItem = (item_id) =>
  api.delete(`/orders/cart/items/${item_id}/remove/`);

export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);
export const createOrder = (data) => api.post('/orders/create/', data);

export const mpesaPayment = (data) => api.post('/payments/mpesa/', data);
export const cardPayment = (data) => api.post('/payments/card/', data);
export const confirmPayment = (payment_id) => api.post(`/payments/${payment_id}/confirm/`);
export const getPaymentHistory = () => api.get('/payments/history/');
