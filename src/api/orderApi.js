import api from './axios'

export const cartApi = {
  getCart:        ()                        => api.get('/api/cart'),
  addItem:        (item)                    => api.post('/api/cart/items', item),
  updateQuantity: (bookId, qty)             => api.patch(`/api/cart/items/${bookId}`, { quantity: qty }),
  removeItem:     (bookId)                  => api.delete(`/api/cart/items/${bookId}`),
  clearCart:      ()                        => api.delete('/api/cart'),
}

export const orderApi = {
  checkout:   (data)    => api.post('/api/orders/checkout', data),
  getOrders:  ()        => api.get('/api/orders'),
  getOrder:   (id)      => api.get(`/api/orders/${id}`),
}

export const wishlistApi = {
  getWishlist:    ()       => api.get('/api/users/me/wishlist'),
  addToWishlist:  (bookId) => api.post(`/api/users/me/wishlist/${bookId}`),
  removeFromList: (bookId) => api.delete(`/api/users/me/wishlist/${bookId}`),
}
