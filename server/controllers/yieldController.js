/**
 * Yield Prediction Controller
 * AI-powered yield and profit estimation
 */
const YieldPrediction = require('../models/YieldPrediction');
const Crop = require('../models/Crop');

// AI Yield Prediction Algorithm (Mock)
const predictYield = (inputData) => {
  const { cropType, soilQuality, rainfall, temperature, area, fertilizerUsed, irrigationType } = inputData;

  // Base yields per acre (tons)
  const baseYields = {
    'Sugarcane': 25, 'Wheat': 3.5, 'Rice': 4.5, 'Cotton': 1.5,
    'Soybean': 1.2, 'Onion': 15, 'Tomato': 20, 'Potato': 18,
    'Maize': 4, 'Barley': 3, 'Chickpea': 1, 'Mustard': 1.5,
    'Groundnut': 1.3, 'Other': 3
  };

  let baseYield = baseYields[cropType] || 3;

  // Soil quality multiplier
  const soilMultipliers = { poor: 0.6, fair: 0.8, good: 1.0, excellent: 1.2 };
  baseYield *= soilMultipliers[soilQuality] || 1.0;

  // Rainfall factor (optimal 800-1200mm)
  if (rainfall < 500) baseYield *= 0.7;
  else if (rainfall < 800) baseYield *= 0.85;
  else if (rainfall > 1500) baseYield *= 0.9;
  else baseYield *= 1.0;

  // Temperature factor (optimal 20-30°C)
  if (temperature < 15 || temperature > 35) baseYield *= 0.8;
  else if (temperature < 20 || temperature > 30) baseYield *= 0.9;

  // Fertilizer bonus
  if (fertilizerUsed) baseYield *= 1.15;

  // Irrigation bonus
  const irrigationBonus = { drip: 1.2, sprinkler: 1.15, flood: 1.0, 'rain-fed': 0.9 };
  baseYield *= irrigationBonus[irrigationType] || 1.0;

  // Calculate total yield
  const estimatedYield = Math.round(baseYield * area * 100) / 100;

  // Calculate profit (mock market prices per ton in INR)
  const marketPrices = {
    'Sugarcane': 3500, 'Wheat': 24000, 'Rice': 22000, 'Cotton': 65000,
    'Soybean': 45000, 'Onion': 18000, 'Tomato': 15000, 'Potato': 12000,
    'Maize': 20000, 'Barley': 18000, 'Chickpea': 55000, 'Mustard': 50000,
    'Groundnut': 60000, 'Other': 25000
  };

  const pricePerTon = marketPrices[cropType] || 25000;
  const estimatedRevenue = estimatedYield * pricePerTon;

  // Estimated costs (roughly 40-60% of revenue)
  const costRatio = 0.5;
  const estimatedProfit = Math.round(estimatedRevenue * (1 - costRatio));

  // Confidence based on data quality
  let confidence = 70;
  if (soilQuality === 'excellent') confidence += 10;
  if (fertilizerUsed) confidence += 5;
  if (irrigationType === 'drip') confidence += 10;
  confidence = Math.min(confidence, 95);

  return {
    estimatedYield,
    unit: 'tons',
    confidence,
    profitEstimate: estimatedProfit,
    profitCurrency: 'INR',
    marketPricePerUnit: pricePerTon
  };
};

exports.predictYield = async (req, res, next) => {
  try {
    const inputData = req.body;
    inputData.farmer = req.user.id;

    // Run AI prediction
    const prediction = predictYield(inputData);

    // Save prediction
    const yieldPrediction = await YieldPrediction.create({
      farmer: req.user.id,
      inputData,
      prediction,
      aiModel: { version: 'AgroYield-v1.2', accuracy: 87.5 }
    });

    res.status(201).json({
      success: true,
      data: {
        predictionId: yieldPrediction._id,
        ...prediction,
        inputData,
        recommendations: generateRecommendations(inputData, prediction)
      }
    });
  } catch (error) { next(error); }
};

const generateRecommendations = (input, prediction) => {
  const recommendations = [];

  if (input.soilQuality === 'poor') {
    recommendations.push('Consider soil amendment with organic matter before planting');
    recommendations.push('Apply balanced NPK fertilizer as per soil test');
  }

  if (input.rainfall < 600) {
    recommendations.push('Install drip irrigation system for water efficiency');
    recommendations.push('Use mulch to reduce evaporation');
  }

  if (input.temperature > 32) {
    recommendations.push('Consider heat-tolerant varieties for next season');
    recommendations.push('Provide shade nets during peak summer');
  }

  if (!input.fertilizerUsed) {
    recommendations.push('Using fertilizers can increase yield by 15%');
  }

  if (prediction.confidence < 80) {
    recommendations.push('For more accurate prediction, provide detailed soil test data');
  }

  return recommendations;
};

exports.getPredictions = async (req, res, next) => {
  try {
    const predictions = await YieldPrediction.find({ farmer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('crop', 'name');

    res.status(200).json({ success: true, count: predictions.length, data: predictions });
  } catch (error) { next(error); }
};

exports.getPrediction = async (req, res, next) => {
  try {
    const prediction = await YieldPrediction.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!prediction) return res.status(404).json({ success: false, message: 'Prediction not found' });

    res.status(200).json({ success: true, data: prediction });
  } catch (error) { next(error); }
};

exports.recordActualYield = async (req, res, next) => {
  try {
    const { actualYield, unit } = req.body;

    let prediction = await YieldPrediction.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!prediction) return res.status(404).json({ success: false, message: 'Prediction not found' });

    prediction.actualYield = {
      value: actualYield,
      unit: unit || 'tons',
      recordedAt: new Date()
    };

    // Calculate accuracy
    const diff = Math.abs(prediction.prediction.estimatedYield - actualYield);
    prediction.accuracy = Math.round((1 - diff / prediction.prediction.estimatedYield) * 100);

    await prediction.save();
    res.status(200).json({ success: true, data: prediction });
  } catch (error) { next(error); }
};
