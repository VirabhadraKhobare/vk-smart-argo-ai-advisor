/**
 * Soil Routes
 * Soil health and report endpoints
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSoilReports,
  getSoilReport,
  createSoilReport,
  updateSoilReport,
  deleteSoilReport,
  getLatestSoilHealth
} = require('../controllers/soilController');

router.get('/', protect, getSoilReports);
router.get('/latest', protect, getLatestSoilHealth);
router.get('/:id', protect, getSoilReport);
router.post('/', protect, createSoilReport);
router.put('/:id', protect, updateSoilReport);
router.delete('/:id', protect, deleteSoilReport);

module.exports = router;
