/**
 * Soil Service
 * Soil health API calls
 */
import api from './api';

const soilService = {
  getReports: async () => {
    const response = await api.get('/soil');
    return response.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/soil/${id}`);
    return response.data;
  },

  getLatest: async () => {
    const response = await api.get('/soil/latest');
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post('/soil', reportData);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await api.put(`/soil/${id}`, reportData);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/soil/${id}`);
    return response.data;
  }
};

export default soilService;
