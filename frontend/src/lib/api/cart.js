import api from '../axios';

export const fetchCart = () =>
  api.get('/cart/').then(res => res.data);

export const addToCart = (prodId) =>
  api.post(`/cart/${prodId}`).then(res => res.data);

export const removeFromCart = (itemId) =>
  api.delete(`/cart/${itemId}`).then(res => res.data);

export const updateCartQuantity = (itemId, newQuantity) =>
  api.put(`/cart/${itemId}`, { quantity: newQuantity }).then(res => res.data);