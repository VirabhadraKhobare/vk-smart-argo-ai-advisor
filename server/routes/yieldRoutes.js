/**
 * Yield Routes
 * Yield prediction endpoints
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  predictYield,
  getPredictions,
  getPrediction,
  recordActualYield
} = require('../controllers/yieldController');

router.post('/predict', protect, predictYield);
router.get('/', protect, getPredictions);
router.get('/:id', protect, getPrediction);
router.put('/:id/actual', protect, recordActualYield);

module.exports = router;
