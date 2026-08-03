import api from '../axios';

export const getCurrentUser = () =>
  api.get('/user/me').then(res => res.data);

export const loginUser = (data) =>
  api.post('/user/login', data).then(res => res.data);

export const signupUser = (data) =>
  api.post('/user/signup', data).then(res => res.data);

export const logoutUser = () =>
  api.post('/user/logout').then(res => res.data);