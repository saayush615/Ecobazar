import api from '../axios';

export const fetchProductReviews = (productId) =>
  api.get(`/review/product/${productId}`).then(res => res.data);

export const addReview = (productId, reviewData) =>
  api.post(`/review/product/${productId}`, reviewData).then(res => res.data);

export const deleteReview = (reviewId) =>
  api.delete(`/review/${reviewId}`).then(res => res.data);