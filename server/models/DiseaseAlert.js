/**
 * Disease Alert Model
 * Stores disease detection results and treatments
 */
const mongoose = require("mongoose");

const diseaseAlertSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: false,
      default: null,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    detectionResult: {
      diseaseName: {
        type: String,
        required: true,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
      },
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    treatment: {
      immediate: [
        {
          action: String,
          urgency: {
            type: String,
            enum: ["immediate", "within-24h", "within-week"],
          },
        },
      ],
      preventive: [
        {
          action: String,
          frequency: String,
        },
      ],
      organic: [
        {
          remedy: String,
          application: String,
        },
      ],
      chemical: [
        {
          name: String,
          dosage: String,
          application: String,
        },
      ],
    },
    status: {
      type: String,
      enum: ["active", "treating", "resolved"],
      default: "active",
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    aiAnalysis: {
      modelVersion: String,
      processingTime: Number,
      additionalNotes: String,
    },
  },
  {
    timestamps: true,
  },
);

diseaseAlertSchema.index({ farmer: 1, status: 1 });
diseaseAlertSchema.index({ detectedAt: -1 });

module.exports = mongoose.model("DiseaseAlert", diseaseAlertSchema);
