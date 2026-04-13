import api from './axios'

export const paymentApi = {
  processPayment: (data) => api.post('/api/payments/process', data),
}
