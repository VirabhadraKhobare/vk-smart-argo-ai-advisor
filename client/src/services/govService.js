/**
 * Government Service
 * Scheme information API calls
 */
import api from './api';

const govService = {
  getSchemes: async (params = {}) => {
    const response = await api.get('/government', { params });
    return response.data;
  },

  getScheme: async (id) => {
    const response = await api.get(`/government/${id}`);
    return response.data;
  }
};

export default govService;
