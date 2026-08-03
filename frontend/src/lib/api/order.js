import api from '../axios';

export const createOrder = () =>
  api.post('/order/create-order').then(res => res.data);

export const verifyPayment = (data) =>
  api.post('/order/verify-payment', data).then(res => res.data);

export const paymentFailure = (checkoutSessionId) =>
  api.post('/order/payment-failure', { checkoutSessionId }).then(res => res.data);

export const createCODOrder = () =>
  api.post('/order/cod-order').then(res => res.data);

export const fetchMyOrders = () =>
  api.get('/order/').then(res => res.data);

export const cancelOrder = (id) =>
  api.put(`/order/${id}`).then(res => res.data);