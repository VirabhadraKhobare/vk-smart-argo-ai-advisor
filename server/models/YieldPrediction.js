/**
 * Yield Prediction Model
 * Stores yield prediction history
 */
const mongoose = require('mongoose');

const yieldPredictionSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  inputData: {
    cropType: { type: String, required: true },
    soilQuality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'], required: true },
    rainfall: { type: Number, required: true }, // in mm
    temperature: { type: Number, required: true }, // avg temp in celsius
    fertilizerUsed: { type: Boolean, default: true },
    irrigationType: { type: String, enum: ['drip', 'sprinkler', 'flood', 'rain-fed'] },
    area: { type: Number, required: true }, // in acres
    areaUnit: { type: String, default: 'acres' }
  },
  prediction: {
    estimatedYield: { type: Number, required: true },
    unit: { type: String, default: 'tons' },
    confidence: { type: Number, min: 0, max: 100 },
    profitEstimate: { type: Number },
    profitCurrency: { type: String, default: 'INR' },
    marketPricePerUnit: { type: Number }
  },
  aiModel: {
    version: String,
    accuracy: Number
  },
  actualYield: {
    value: Number,
    unit: String,
    recordedAt: Date
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

yieldPredictionSchema.index({ farmer: 1, createdAt: -1 });

module.exports = mongoose.model('YieldPrediction', yieldPredictionSchema);
