import api from './axios'

export const bookApi = {
  getBooks:     (params) => api.get('/api/books', { params }),
  getFeatured:  ()       => api.get('/api/books/featured'),
  getBook:      (id)     => api.get(`/api/books/${id}`),
  createBook:   (data)   => api.post('/api/books', data),
  updateBook:   (id, d)  => api.put(`/api/books/${id}`, d),
  deleteBook:   (id)     => api.delete(`/api/books/${id}`),
  getMyBooks:   ()       => api.get('/api/books/seller/my-books'),

  // Reviews
  getReviews:   (bookId) => api.get(`/api/reviews/${bookId}`),
  addReview:    (data)   => api.post('/api/reviews', data),
}
