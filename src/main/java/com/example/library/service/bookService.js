import API from './api';

export const bookService = {
  getAllBooks: () => API.get('/books'),
  getBookById: (id) => API.get(`/books/${id}`),
  createBook: (book) => API.post('/books', book),
  updateBook: (id, book) => API.put(`/books/${id}`, book),
  deleteBook: (id) => API.delete(`/books/${id}`),
  searchBooks: (keyword) => API.get(`/books/search?keyword=${keyword}`)
};