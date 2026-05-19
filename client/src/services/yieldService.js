/**
 * Yield Service
 * Yield prediction API calls
 */
import api from './api';

const yieldService = {
  predict: async (inputData) => {
    const response = await api.post('/yield/predict', inputData);
    return response.data;
  },

  getPredictions: async () => {
    const response = await api.get('/yield');
    return response.data;
  },

  getPrediction: async (id) => {
    const response = await api.get(`/yield/${id}`);
    return response.data;
  },

  recordActual: async (id, actualData) => {
    const response = await api.put(`/yield/${id}/actual`, actualData);
    return response.data;
  }
};

export default yieldService;
