/**
 * Disease Service
 * Disease detection API calls
 */
import api from './api';

const diseaseService = {
  detectDisease: async (imageFile, cropId = null) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (cropId) formData.append('cropId', cropId);

    const response = await api.post('/disease/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAlerts: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/disease/alerts', { params });
    return response.data;
  },

  getAlert: async (id) => {
    const response = await api.get(`/disease/alerts/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/disease/alerts/${id}/status`, { status });
    return response.data;
  }
};

export default diseaseService;
