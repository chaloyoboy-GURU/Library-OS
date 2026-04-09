import API from './api.js';

export const borrowService = {
  borrowBook: (studentId, bookId, durationDays = 14) =>
    API.post(`/borrows/borrow/${studentId}`, { bookId, durationDays }),

  returnBook: (borrowRecordId, notes) =>
    API.put(`/borrows/return/${borrowRecordId}`, null, { params: { notes } }),

  getCurrentBorrows: (studentId) =>
    API.get(`/borrows/student/${studentId}/current`),

  getBorrowHistory: (studentId) =>
    API.get(`/borrows/student/${studentId}`)
};