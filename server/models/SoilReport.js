/**
 * Soil Report Model
 * Stores soil health data and recommendations
 */
const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fieldBlock: {
    type: String,
    required: true,
    trim: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  nutrients: {
    nitrogen: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'kg/ha' },
      status: { type: String, enum: ['low', 'medium', 'high', 'optimal'], default: 'medium' }
    },
    phosphorus: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'kg/ha' },
      status: { type: String, enum: ['low', 'medium', 'high', 'optimal'], default: 'medium' }
    },
    potassium: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'kg/ha' },
      status: { type: String, enum: ['low', 'medium', 'high', 'optimal'], default: 'medium' }
    }
  },
  ph: {
    value: { type: Number, required: true, min: 0, max: 14 },
    status: { type: String, enum: ['acidic', 'neutral', 'alkaline'], default: 'neutral' }
  },
  moisture: {
    value: { type: Number, required: true, min: 0, max: 100 },
    unit: { type: String, default: '%' }
  },
  organicMatter: {
    value: Number,
    unit: { type: String, default: '%' }
  },
  texture: {
    type: String,
    enum: ['sandy', 'loamy', 'clay', 'silty', 'sandy-loam', 'clay-loam', 'silty-loam']
  },
  overallHealth: {
    score: { type: Number, min: 0, max: 100 },
    status: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] }
  },
  aiRecommendations: [{
    nutrient: String,
    recommendation: String,
    quantity: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] }
  }],
  testedBy: {
    type: String,
    trim: true
  },
  labName: {
    type: String,
    trim: true
  },
  notes: String
}, {
  timestamps: true
});

soilReportSchema.index({ farmer: 1, testDate: -1 });

module.exports = mongoose.model('SoilReport', soilReportSchema);
