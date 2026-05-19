/**
 * Weather Data Model
 * Caches weather data to reduce API calls
 */
const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  location: {
    city: { type: String, required: true },
    state: String,
    country: { type: String, default: 'India' },
    coordinates: {
      lat: Number,
      lon: Number
    }
  },
  current: {
    temperature: Number,
    feelsLike: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    windDirection: Number,
    visibility: Number,
    uvIndex: Number,
    condition: String,
    description: String,
    icon: String
  },
  forecast: [{
    date: Date,
    temperature: {
      min: Number,
      max: Number
    },
    humidity: Number,
    windSpeed: Number,
    condition: String,
    description: String,
    icon: String,
    rainProbability: Number,
    rainAmount: Number
  }],
  agricultural: {
    soilTemperature: Number,
    evapotranspiration: Number,
    growingDegreeDays: Number,
    frostRisk: { type: Boolean, default: false },
    heatStressRisk: { type: Boolean, default: false }
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000) // 30 minutes cache
  }
});

weatherDataSchema.index({ 'location.city': 1, fetchedAt: -1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);
