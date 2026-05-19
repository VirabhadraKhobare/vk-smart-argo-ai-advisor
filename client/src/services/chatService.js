/**
 * Chat Service
 * AI assistant API calls
 */
import api from './api';

const chatService = {
  sendMessage: async (content, sessionId = 'default') => {
    const response = await api.post('/chat/message', { content, sessionId });
    return response.data;
  },

  getHistory: async (sessionId) => {
    const params = sessionId ? { sessionId } : {};
    const response = await api.get('/chat/history', { params });
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get('/chat/sessions');
    return response.data;
  }
};

export default chatService;
