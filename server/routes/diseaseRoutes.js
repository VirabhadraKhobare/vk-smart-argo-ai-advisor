/**
 * Disease Routes
 * Disease detection and alert endpoints
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  detectDisease,
  getDiseaseAlerts,
  getDiseaseAlert,
  updateAlertStatus
} = require('../controllers/diseaseController');

router.post('/detect', protect, upload.single('image'), detectDisease);
router.get('/alerts', protect, getDiseaseAlerts);
router.get('/alerts/:id', protect, getDiseaseAlert);
router.put('/alerts/:id/status', protect, updateAlertStatus);

module.exports = router;
