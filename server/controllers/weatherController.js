/**
 * Weather Controller
 * Integrates with OpenWeatherMap API and caches data
 */
const axios = require('axios');
const WeatherData = require('../models/WeatherData');

const OPENWEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock weather data for development (fallback)
const getMockWeather = (city) => ({
  location: { city: city || 'Pune', state: 'Maharashtra', country: 'India' },
  current: {
    temperature: 28,
    feelsLike: 30,
    humidity: 68,
    pressure: 1012,
    windSpeed: 14,
    windDirection: 180,
    visibility: 10000,
    uvIndex: 6,
    condition: 'Partly Cloudy',
    description: 'Partly cloudy with moderate humidity',
    icon: '03d'
  },
  forecast: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
    temperature: { min: 22 + Math.random() * 3, max: 30 + Math.random() * 4 },
    humidity: 60 + Math.floor(Math.random() * 20),
    windSpeed: 10 + Math.floor(Math.random() * 10),
    condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
    description: 'Typical monsoon weather',
    icon: ['01d', '03d', '04d', '10d'][Math.floor(Math.random() * 4)],
    rainProbability: Math.floor(Math.random() * 60),
    rainAmount: Math.random() * 5
  })),
  agricultural: {
    soilTemperature: 26,
    evapotranspiration: 4.2,
    growingDegreeDays: 320,
    frostRisk: false,
    heatStressRisk: false
  }
});

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { city = 'Pune' } = req.query;

    // Check cache first
    const cached = await WeatherData.findOne({
      'location.city': city,
      expiresAt: { $gt: new Date() }
    }).sort({ fetchedAt: -1 });

    if (cached) {
      return res.status(200).json({ success: true, data: cached, source: 'cache' });
    }

    // Try to fetch from API
    let weatherData;
    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather?q=${city},IN&appid=${OPENWEATHER_API_KEY}&units=metric`),
        axios.get(`${BASE_URL}/forecast?q=${city},IN&appid=${OPENWEATHER_API_KEY}&units=metric`)
      ]);

      const current = currentRes.data;
      const forecast = forecastRes.data;

      weatherData = {
        location: {
          city: current.name,
          country: current.sys.country,
          coordinates: { lat: current.coord.lat, lon: current.coord.lon }
        },
        current: {
          temperature: current.main.temp,
          feelsLike: current.main.feels_like,
          humidity: current.main.humidity,
          pressure: current.main.pressure,
          windSpeed: current.wind.speed,
          windDirection: current.wind.deg,
          visibility: current.visibility,
          uvIndex: 0, // Would need separate UV API
          condition: current.weather[0].main,
          description: current.weather[0].description,
          icon: current.weather[0].icon
        },
        forecast: forecast.list.filter((_, i) => i % 8 === 0).slice(0, 7).map(item => ({
          date: new Date(item.dt * 1000),
          temperature: { min: item.main.temp_min, max: item.main.temp_max },
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          rainProbability: item.pop * 100,
          rainAmount: item.rain?.['3h'] || 0
        })),
        agricultural: {
          soilTemperature: current.main.temp - 2,
          evapotranspiration: 4.5,
          growingDegreeDays: 300,
          frostRisk: current.main.temp < 5,
          heatStressRisk: current.main.temp > 35
        }
      };
    } catch (apiError) {
      console.warn('Weather API failed, using mock data:', apiError.message);
      weatherData = getMockWeather(city);
    }

    // Save to cache
    const weatherDoc = await WeatherData.create({
      ...weatherData,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    res.status(200).json({ success: true, data: weatherDoc, source: 'api' });
  } catch (error) { next(error); }
};

exports.getWeatherForecast = async (req, res, next) => {
  try {
    const { city = 'Pune', days = 7 } = req.query;

    const weather = await WeatherData.findOne({
      'location.city': city,
      expiresAt: { $gt: new Date() }
    }).sort({ fetchedAt: -1 });

    if (!weather) {
      return res.status(404).json({ success: false, message: 'Weather data not available' });
    }

    res.status(200).json({
      success: true,
      data: weather.forecast.slice(0, parseInt(days))
    });
  } catch (error) { next(error); }
};

exports.getIrrigationSuggestion = async (req, res, next) => {
  try {
    const { city = 'Pune', cropType = 'general' } = req.query;

    const weather = await WeatherData.findOne({
      'location.city': city,
      expiresAt: { $gt: new Date() }
    }).sort({ fetchedAt: -1 });

    if (!weather) {
      return res.status(404).json({ success: false, message: 'Weather data not available' });
    }

    const current = weather.current;
    const tomorrow = weather.forecast[0];

    // AI-like irrigation logic
    let suggestion = {
      shouldIrrigate: true,
      urgency: 'normal',
      amount: 'normal',
      reason: '',
      bestTime: 'Early morning (5-7 AM)',
      tips: []
    };

    if (tomorrow.rainProbability > 70) {
      suggestion.shouldIrrigate = false;
      suggestion.urgency = 'low';
      suggestion.reason = `Heavy rain expected tomorrow (${tomorrow.rainProbability}% chance). Skip irrigation to prevent waterlogging.`;
      suggestion.tips.push('Check drainage systems', 'Monitor soil moisture after rain');
    } else if (current.humidity > 80) {
      suggestion.shouldIrrigate = false;
      suggestion.urgency = 'low';
      suggestion.reason = 'High humidity levels detected. Soil moisture is likely adequate.';
      suggestion.tips.push('Monitor for fungal diseases in high humidity');
    } else if (current.temperature > 35) {
      suggestion.urgency = 'high';
      suggestion.amount = 'increased';
      suggestion.reason = 'High temperature detected. Increase water to prevent heat stress.';
      suggestion.bestTime = 'Early morning (5-6 AM) or evening (6-8 PM)';
      suggestion.tips.push('Use mulch to retain moisture', 'Check for heat stress symptoms');
    } else if (current.humidity < 40) {
      suggestion.urgency = 'medium';
      suggestion.reason = 'Low humidity may increase evaporation. Regular irrigation recommended.';
    }

    // Crop-specific adjustments
    if (cropType === 'rice') {
      suggestion.tips.push('Maintain 2-5 cm standing water for rice paddies');
    } else if (cropType === 'sugarcane') {
      suggestion.tips.push('Sugarcane needs consistent moisture - avoid drought stress');
    }

    res.status(200).json({ success: true, data: suggestion });
  } catch (error) { next(error); }
};
