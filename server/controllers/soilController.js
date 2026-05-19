/**
 * Soil Controller
 * Manages soil reports and AI recommendations
 */
const SoilReport = require('../models/SoilReport');

// AI Recommendation Generator (Mock)
const generateAIRecommendations = (nutrients, ph, moisture, texture) => {
  const recommendations = [];

  // Nitrogen recommendations
  if (nutrients.nitrogen.status === 'low') {
    recommendations.push({
      nutrient: 'Nitrogen',
      recommendation: 'Apply Urea or Ammonium Nitrate',
      quantity: '50-60 kg/ha',
      priority: 'high'
    });
  } else if (nutrients.nitrogen.status === 'high') {
    recommendations.push({
      nutrient: 'Nitrogen',
      recommendation: 'Reduce nitrogen input, focus on phosphorus and potassium',
      quantity: '20-30 kg/ha',
      priority: 'medium'
    });
  }

  // Phosphorus recommendations
  if (nutrients.phosphorus.status === 'low') {
    recommendations.push({
      nutrient: 'Phosphorus',
      recommendation: 'Apply Single Super Phosphate or DAP',
      quantity: '40-50 kg/ha',
      priority: 'high'
    });
  }

  // Potassium recommendations
  if (nutrients.potassium.status === 'low') {
    recommendations.push({
      nutrient: 'Potassium',
      recommendation: 'Apply Muriate of Potash (MOP)',
      quantity: '30-40 kg/ha',
      priority: 'high'
    });
  }

  // pH recommendations
  if (ph.status === 'acidic') {
    recommendations.push({
      nutrient: 'pH Balance',
      recommendation: 'Apply agricultural lime to raise pH',
      quantity: '2-3 tonnes/ha',
      priority: 'medium'
    });
  } else if (ph.status === 'alkaline') {
    recommendations.push({
      nutrient: 'pH Balance',
      recommendation: 'Apply gypsum or sulfur to lower pH',
      quantity: '1-2 tonnes/ha',
      priority: 'medium'
    });
  }

  // Moisture recommendations
  if (moisture.value < 30) {
    recommendations.push({
      nutrient: 'Moisture',
      recommendation: 'Increase irrigation frequency, consider drip irrigation',
      quantity: 'Daily monitoring required',
      priority: 'high'
    });
  }

  // Texture-based organic matter
  if (texture && (texture.includes('sandy') || texture.includes('loamy'))) {
    recommendations.push({
      nutrient: 'Organic Matter',
      recommendation: 'Add compost or farmyard manure',
      quantity: '5-10 tonnes/ha',
      priority: 'medium'
    });
  }

  return recommendations;
};

// Calculate overall health score
const calculateHealthScore = (nutrients, ph, moisture) => {
  let score = 0;
  const weights = { nitrogen: 25, phosphorus: 20, potassium: 20, ph: 20, moisture: 15 };

  // Nitrogen score
  if (nutrients.nitrogen.status === 'optimal') score += weights.nitrogen;
  else if (nutrients.nitrogen.status === 'high') score += weights.nitrogen * 0.8;
  else if (nutrients.nitrogen.status === 'medium') score += weights.nitrogen * 0.6;
  else score += weights.nitrogen * 0.3;

  // Phosphorus score
  if (nutrients.phosphorus.status === 'optimal') score += weights.phosphorus;
  else if (nutrients.phosphorus.status === 'high') score += weights.phosphorus * 0.8;
  else if (nutrients.phosphorus.status === 'medium') score += weights.phosphorus * 0.6;
  else score += weights.phosphorus * 0.3;

  // Potassium score
  if (nutrients.potassium.status === 'optimal') score += weights.potassium;
  else if (nutrients.potassium.status === 'high') score += weights.potassium * 0.8;
  else if (nutrients.potassium.status === 'medium') score += weights.potassium * 0.6;
  else score += weights.potassium * 0.3;

  // pH score (optimal is 6.5-7.5)
  const phValue = ph.value;
  if (phValue >= 6.5 && phValue <= 7.5) score += weights.ph;
  else if (phValue >= 6.0 && phValue < 6.5) score += weights.ph * 0.8;
  else if (phValue > 7.5 && phValue <= 8.0) score += weights.ph * 0.8;
  else score += weights.ph * 0.4;

  // Moisture score (optimal 40-60%)
  const moistureValue = moisture.value;
  if (moistureValue >= 40 && moistureValue <= 60) score += weights.moisture;
  else if (moistureValue >= 30 && moistureValue < 40) score += weights.moisture * 0.8;
  else if (moistureValue > 60 && moistureValue <= 70) score += weights.moisture * 0.8;
  else score += weights.moisture * 0.4;

  return Math.round(score);
};

exports.getSoilReports = async (req, res, next) => {
  try {
    const reports = await SoilReport.find({ farmer: req.user.id })
      .sort({ testDate: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) { next(error); }
};

exports.getSoilReport = async (req, res, next) => {
  try {
    const report = await SoilReport.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.createSoilReport = async (req, res, next) => {
  try {
    const { fieldBlock, nutrients, ph, moisture, organicMatter, texture, testedBy, labName, notes } = req.body;

    // Calculate overall health
    const healthScore = calculateHealthScore(nutrients, ph, moisture);
    const healthStatus = healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : healthScore >= 40 ? 'fair' : 'poor';

    // Generate AI recommendations
    const aiRecommendations = generateAIRecommendations(nutrients, ph, moisture, texture);

    const report = await SoilReport.create({
      farmer: req.user.id,
      fieldBlock,
      nutrients,
      ph,
      moisture,
      organicMatter,
      texture,
      overallHealth: { score: healthScore, status: healthStatus },
      aiRecommendations,
      testedBy,
      labName,
      notes
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.updateSoilReport = async (req, res, next) => {
  try {
    let report = await SoilReport.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!report) return res.status(404).json({ success: false, message: 'Soil report not found' });

    report = await SoilReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.deleteSoilReport = async (req, res, next) => {
  try {
    const report = await SoilReport.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!report) return res.status(404).json({ success: false, message: 'Soil report not found' });

    await report.deleteOne();
    res.status(200).json({ success: true, message: 'Soil report deleted' });
  } catch (error) { next(error); }
};

exports.getLatestSoilHealth = async (req, res, next) => {
  try {
    const latestReport = await SoilReport.findOne({ farmer: req.user.id })
      .sort({ testDate: -1 })
      .limit(1);

    if (!latestReport) {
      return res.status(404).json({ success: false, message: 'No soil reports found' });
    }

    res.status(200).json({ success: true, data: latestReport });
  } catch (error) { next(error); }
};
