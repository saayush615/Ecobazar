import api from '../axios';

export const fetchWishlist = () =>
  api.get('/fav/').then(res => res.data);

export const addToWishlist = (productId) =>
  api.post('/fav/', { productId }).then(res => res.data);

export const removeFromWishlist = (favoriteId) =>
  api.delete(`/fav/${favoriteId}`).then(res => res.data);