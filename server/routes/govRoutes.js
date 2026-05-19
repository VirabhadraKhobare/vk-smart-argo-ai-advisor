/**
 * Government Routes
 * Scheme information endpoints
 */
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getSchemes,
  getScheme,
  createScheme,
  updateScheme,
  deleteScheme
} = require('../controllers/govController');

router.get('/', getSchemes);
router.get('/:id', getScheme);
router.post('/', protect, adminOnly, createScheme);
router.put('/:id', protect, adminOnly, updateScheme);
router.delete('/:id', protect, adminOnly, deleteScheme);

module.exports = router;
