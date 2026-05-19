/**
 * Government Scheme Model
 * Stores government farming schemes and subsidies
 */
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['subsidy', 'insurance', 'loan', 'pension', 'grant', 'training', 'other'],
    required: true
  },
  ministry: {
    type: String,
    trim: true
  },
  eligibility: {
    type: String,
    required: true
  },
  benefits: [{
    type: String
  }],
  documentsRequired: [{
    type: String
  }],
  applicationProcess: {
    type: String
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'upcoming'],
    default: 'active'
  },
  websiteUrl: {
    type: String,
    trim: true
  },
  contactInfo: {
    phone: String,
    email: String,
    office: String
  },
  stateSpecific: {
    type: Boolean,
    default: false
  },
  applicableStates: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

schemeSchema.index({ category: 1, status: 1 });
schemeSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('GovernmentScheme', schemeSchema);
