/**
 * Community Service
 * Discussion forum API calls
 */
import api from './api';

const communityService = {
  getPosts: async (params = {}) => {
    const response = await api.get('/community', { params });
    return response.data;
  },

  getPost: async (id) => {
    const response = await api.get(`/community/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/community', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/community/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/community/${id}`);
    return response.data;
  },

  likePost: async (id) => {
    const response = await api.post(`/community/${id}/like`);
    return response.data;
  },

  addComment: async (id, content) => {
    const response = await api.post(`/community/${id}/comments`, { content });
    return response.data;
  }
};

export default communityService;
