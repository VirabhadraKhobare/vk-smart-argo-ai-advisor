/**
 * Weather Routes
 * Weather data and irrigation suggestions
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCurrentWeather,
  getWeatherForecast,
  getIrrigationSuggestion
} = require('../controllers/weatherController');

router.get('/current', protect, getCurrentWeather);
router.get('/forecast', protect, getWeatherForecast);
router.get('/irrigation-suggestion', protect, getIrrigationSuggestion);

module.exports = router;
