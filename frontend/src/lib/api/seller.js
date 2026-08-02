import api from '../axios';

export const fetchSellerProducts = () =>
  api.get('/seller/').then(res => res.data);

export const createSellerProduct = (formData) =>
  api.post('/seller/', formData).then(res => res.data);

export const updateSellerProduct = (id, formData) =>
  api.put(`/seller/${id}`, formData).then(res => res.data);

export const deleteSellerProduct = (id) =>
  api.delete(`/seller/${id}`).then(res => res.data);

export const fetchSellerOrders = () =>
  api.get('/seller/orders').then(res => res.data);

export const fetchSellerOrderHistory = () =>
  api.get('/seller/order-history').then(res => res.data);

export const updateOrderStatus = (orderId, changedStatus) =>
  api.patch(`/seller/orderStatus/${orderId}`, { changedStatus }).then(res => res.data);