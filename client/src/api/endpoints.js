import apiClient from './axios.js';

// Auth APIs
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  refreshToken: (refreshToken) =>
    apiClient.post('/auth/refresh-token', { refreshToken }),
};

// User APIs
export const userAPI = {
  updateProfile: (data) => apiClient.put('/users/profile', data),
  uploadProfilePhoto: (formData) =>
    apiClient.post('/users/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserProfile: (userId) => apiClient.get(`/users/profile/${userId}`),
  getAllUsers: (params) => apiClient.get('/users', { params }),
};

// Event APIs
export const eventAPI = {
  createEvent: (data) => apiClient.post('/events', data),
  updateEvent: (eventId, data) => apiClient.put(`/events/${eventId}`, data),
  publishEvent: (eventId) => apiClient.patch(`/events/${eventId}/publish`),
  deleteEvent: (eventId) => apiClient.delete(`/events/${eventId}`),
  getEventById: (eventId) => apiClient.get(`/events/${eventId}`),
  getAllEvents: (params) => apiClient.get('/events', { params }),
  getOrganizerEvents: (params) =>
    apiClient.get('/events/organizer/my-events', { params }),
};

// Application APIs
export const applicationAPI = {
  applyToEvent: (eventId, data) =>
    apiClient.post(`/applications/${eventId}/apply`, data),
  getStudentApplications: (params) =>
    apiClient.get('/applications/my-applications', { params }),
  getEventApplications: (eventId, params) =>
    apiClient.get(`/applications/event/${eventId}/applicants`, { params }),
  updateApplicationStatus: (applicationId, data) =>
    apiClient.patch(`/applications/${applicationId}/status`, data),
  cancelApplication: (applicationId) =>
    apiClient.delete(`/applications/${applicationId}/cancel`),
};

export default {
  authAPI,
  userAPI,
  eventAPI,
  applicationAPI,
};
