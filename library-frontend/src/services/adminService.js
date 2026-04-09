import API from './api.js';

export const adminService = {
    getAllUsers: () => API.get('/admin/users'),
    updateUserRole: (id, role) => API.put(`/admin/users/${id}/role?role=${role}`),
    deleteUser: (id) => API.delete(`/admin/users/${id}`),
    getStats: () => API.get('/admin/stats')
};