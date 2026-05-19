/**
 * Crop Routes
 * Crop management endpoints
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  updateHealth,
  getAnalytics
} = require('../controllers/cropController');

router.get('/', protect, getCrops);
router.get('/analytics/overview', protect, getAnalytics);
router.get('/:id', protect, getCrop);
router.post('/', protect, createCrop);
router.put('/:id', protect, updateCrop);
router.delete('/:id', protect, deleteCrop);
router.put('/:id/health', protect, updateHealth);

module.exports = router;
