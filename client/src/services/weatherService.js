/**
 * Weather Service
 * Weather data API calls
 */
import api from './api';

const weatherService = {
  getCurrent: async (city = 'Pune') => {
    const response = await api.get('/weather/current', { params: { city } });
    return response.data;
  },

  getForecast: async (city = 'Pune', days = 7) => {
    const response = await api.get('/weather/forecast', { params: { city, days } });
    return response.data;
  },

  getIrrigationSuggestion: async (city = 'Pune', cropType = 'general') => {
    const response = await api.get('/weather/irrigation-suggestion', {
      params: { city, cropType }
    });
    return response.data;
  }
};

export default weatherService;
