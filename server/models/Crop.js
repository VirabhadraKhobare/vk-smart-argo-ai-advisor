/**
 * Crop Model
 * Stores crop information, health data, and growth tracking
 */
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide crop name'],
    trim: true,
    enum: [
      'Sugarcane', 'Wheat', 'Rice', 'Cotton', 'Soybean',
      'Onion', 'Tomato', 'Potato', 'Maize', 'Barley',
      'Chickpea', 'Mustard', 'Groundnut', 'Other'
    ]
  },
  variety: {
    type: String,
    trim: true
  },
  fieldBlock: {
    type: String,
    trim: true,
    default: 'A'
  },
  plantedDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date
  },
  area: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['acres', 'hectares'], default: 'acres' }
  },
  status: {
    type: String,
    enum: ['planted', 'growing', 'flowering', 'harvesting', 'harvested', 'diseased'],
    default: 'planted'
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  healthHistory: [{
    date: { type: Date, default: Date.now },
    score: { type: Number, min: 0, max: 100 },
    notes: String
  }],
  growthStage: {
    type: String,
    enum: ['germination', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvest'],
    default: 'germination'
  },
  irrigation: {
    method: { type: String, enum: ['drip', 'sprinkler', 'flood', 'rain-fed'], default: 'drip' },
    frequency: String,
    lastIrrigated: Date,
    nextIrrigation: Date
  },
  fertilizers: [{
    type: { type: String },
    quantity: Number,
    unit: String,
    appliedDate: Date,
    notes: String
  }],
  pests: [{
    name: String,
    severity: { type: String, enum: ['low', 'medium', 'high'] },
    detectedDate: Date,
    treatment: String
  }],
  yieldEstimate: {
    estimated: Number,
    unit: { type: String, default: 'tons' },
    confidence: { type: Number, min: 0, max: 100 }
  },
  profitEstimate: {
    estimated: Number,
    currency: { type: String, default: 'INR' }
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for farmer + name queries
cropSchema.index({ farmer: 1, name: 1 });
cropSchema.index({ status: 1 });

module.exports = mongoose.model('Crop', cropSchema);
