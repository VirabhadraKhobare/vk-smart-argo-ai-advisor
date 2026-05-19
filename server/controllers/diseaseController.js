/**
 * Disease Detection Controller
 * Handles image uploads and mock AI disease detection
 */
const DiseaseAlert = require("../models/DiseaseAlert");
const Crop = require("../models/Crop");
const path = require("path");

// Mock disease database for AI simulation
const diseaseDatabase = {
  leaf_blight: {
    name: "Leaf Blight",
    symptoms: ["Brown spots on leaves", "Yellowing margins", "Leaf curling"],
    treatment: {
      immediate: [
        { action: "Remove and destroy infected leaves", urgency: "immediate" },
        { action: "Apply copper-based fungicide", urgency: "within-24h" },
      ],
      preventive: [
        {
          action: "Ensure proper spacing for air circulation",
          frequency: "ongoing",
        },
        { action: "Avoid overhead irrigation", frequency: "ongoing" },
      ],
      organic: [
        {
          remedy: "Neem oil spray",
          application: "Mix 5ml neem oil per liter water, spray every 7 days",
        },
        {
          remedy: "Baking soda solution",
          application: "Mix 1 tbsp baking soda + 1 tsp oil per liter water",
        },
      ],
      chemical: [
        {
          name: "Mancozeb 75% WP",
          dosage: "2g per liter water",
          application: "Spray at 7-10 day intervals",
        },
        {
          name: "Carbendazim 50% WP",
          dosage: "1g per liter water",
          application: "Spray at first sign of disease",
        },
      ],
    },
  },
  powdery_mildew: {
    name: "Powdery Mildew",
    symptoms: [
      "White powdery patches",
      "Distorted growth",
      "Premature leaf drop",
    ],
    treatment: {
      immediate: [
        { action: "Prune affected plant parts", urgency: "immediate" },
        { action: "Improve air circulation", urgency: "within-24h" },
      ],
      preventive: [
        { action: "Plant resistant varieties", frequency: "seasonal" },
        { action: "Maintain proper plant spacing", frequency: "ongoing" },
      ],
      organic: [
        {
          remedy: "Milk spray",
          application: "Mix 1:9 milk to water, spray weekly",
        },
        {
          remedy: "Garlic extract",
          application: "Soak crushed garlic in water for 24h, strain and spray",
        },
      ],
      chemical: [
        {
          name: "Sulfur 80% WP",
          dosage: "3g per liter water",
          application: "Apply during cool weather",
        },
      ],
    },
  },
  root_rot: {
    name: "Root Rot",
    symptoms: [
      "Wilting despite adequate water",
      "Brown/black roots",
      "Stunted growth",
    ],
    treatment: {
      immediate: [
        { action: "Stop watering immediately", urgency: "immediate" },
        { action: "Improve drainage", urgency: "within-24h" },
      ],
      preventive: [
        { action: "Use well-draining soil", frequency: "planting" },
        { action: "Avoid over-irrigation", frequency: "ongoing" },
      ],
      organic: [
        {
          remedy: "Trichoderma biofungicide",
          application: "Apply 5g per plant near root zone",
        },
      ],
      chemical: [
        {
          name: "Metalaxyl 35% WS",
          dosage: "2g per liter water",
          application: "Drench soil around roots",
        },
      ],
    },
  },
  aphid_infestation: {
    name: "Aphid Infestation",
    symptoms: [
      "Clustered insects on undersides of leaves",
      "Sticky honeydew",
      "Sooty mold",
    ],
    treatment: {
      immediate: [
        {
          action: "Spray strong water jet to dislodge aphids",
          urgency: "immediate",
        },
        {
          action: "Introduce ladybugs (natural predator)",
          urgency: "within-24h",
        },
      ],
      preventive: [
        { action: "Use reflective mulches", frequency: "seasonal" },
        { action: "Plant trap crops", frequency: "seasonal" },
      ],
      organic: [
        {
          remedy: "Soap spray",
          application: "Mix 1 tsp mild soap per liter water",
        },
        {
          remedy: "Neem oil",
          application: "5ml per liter water, spray every 5-7 days",
        },
      ],
      chemical: [
        {
          name: "Imidacloprid 17.8% SL",
          dosage: "0.5ml per liter water",
          application: "Systemic insecticide",
        },
      ],
    },
  },
};

// Mock AI detection function
const mockDetectDisease = (filename) => {
  // Simulate AI processing with random selection
  const diseases = Object.keys(diseaseDatabase);
  const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = 75 + Math.floor(Math.random() * 24); // 75-99%

  return {
    diseaseName: diseaseDatabase[selectedDisease].name,
    confidence,
    severity: confidence > 90 ? "high" : confidence > 80 ? "medium" : "low",
    symptoms: diseaseDatabase[selectedDisease].symptoms,
    treatment: diseaseDatabase[selectedDisease].treatment,
    aiAnalysis: {
      modelVersion: "AgroAI-v2.4",
      processingTime: 1.2 + Math.random() * 2,
      additionalNotes:
        "Analysis based on visual pattern recognition and color spectrum analysis.",
    },
  };
};

exports.detectDisease = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }

    const { cropId } = req.body;

    // Validate crop belongs to user
    if (cropId) {
      const crop = await Crop.findOne({ _id: cropId, farmer: req.user.id });
      if (!crop) {
        return res
          .status(404)
          .json({ success: false, message: "Crop not found" });
      }
    }

    // Mock AI detection
    const detectionResult = mockDetectDisease(req.file.filename);

    // Create disease alert
    const alert = await DiseaseAlert.create({
      farmer: req.user.id,
      imageUrl: `/uploads/${req.file.filename}`,
      detectionResult: {
        diseaseName: detectionResult.diseaseName,
        confidence: detectionResult.confidence,
        severity: detectionResult.severity,
      },
      symptoms: detectionResult.symptoms,
      treatment: detectionResult.treatment,
      aiAnalysis: detectionResult.aiAnalysis,
      ...(cropId ? { crop: cropId } : {}),
    });

    res.status(201).json({
      success: true,
      message: "Disease detected successfully",
      data: {
        alertId: alert._id,
        diseaseName: detectionResult.diseaseName,
        confidence: detectionResult.confidence,
        severity: detectionResult.severity,
        symptoms: detectionResult.symptoms,
        treatment: detectionResult.treatment,
        imageUrl: alert.imageUrl,
        aiAnalysis: detectionResult.aiAnalysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getDiseaseAlerts = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { farmer: req.user.id };
    if (status) query.status = status;

    const alerts = await DiseaseAlert.find(query)
      .sort({ detectedAt: -1 })
      .populate("crop", "name fieldBlock");

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};

exports.getDiseaseAlert = async (req, res, next) => {
  try {
    const alert = await DiseaseAlert.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    }).populate("crop", "name fieldBlock");

    if (!alert)
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });

    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

exports.updateAlertStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let alert = await DiseaseAlert.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });
    if (!alert)
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });

    alert.status = status;
    if (status === "resolved") alert.resolvedAt = new Date();

    await alert.save();
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};
