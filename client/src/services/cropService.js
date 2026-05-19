/**
 * Crop Service
 * Crop management API calls
 */
import api from './api';

const cropService = {
  getCrops: async (params = {}) => {
    const response = await api.get('/crops', { params });
    return response.data;
  },

  getCrop: async (id) => {
    const response = await api.get(`/crops/${id}`);
    return response.data;
  },

  createCrop: async (cropData) => {
    const response = await api.post('/crops', cropData);
    return response.data;
  },

  updateCrop: async (id, cropData) => {
    const response = await api.put(`/crops/${id}`, cropData);
    return response.data;
  },

  deleteCrop: async (id) => {
    const response = await api.delete(`/crops/${id}`);
    return response.data;
  },

  updateHealth: async (id, healthData) => {
    const response = await api.put(`/crops/${id}/health`, healthData);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/crops/analytics/overview');
    return response.data;
  }
};

export default cropService;
