import api from '../axios';

export const fetchAllProducts = () =>
  api.get('/product/all').then(res => res.data);

export const fetchProductsById = (id) =>
  api.get(`/product/${id}`).then(res => res.data);

export const fetchProductsByCategory = (slug) =>
  api.get(`/product/filter/${slug}`).then(res => res.data);