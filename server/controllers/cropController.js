/**
 * Crop Controller
 * Manages crop data, health tracking, and analytics
 */
const Crop = require('../models/Crop');

// @desc    Get all crops for logged in farmer
// @route   GET /api/crops
// @access  Private
exports.getCrops = async (req, res, next) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    let query = { farmer: req.user.id, isActive: true };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { variety: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const crops = await Crop.find(query)
      .sort({ [sortBy]: sortOrder })
      .populate('farmer', 'name location');

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single crop
// @route   GET /api/crops/:id
// @access  Private
exports.getCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id
    }).populate('farmer', 'name location');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
exports.createCrop = async (req, res, next) => {
  try {
    req.body.farmer = req.user.id;

    const crop = await Crop.create(req.body);

    res.status(201).json({
      success: true,
      data: crop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
exports.updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop (soft delete)
// @route   DELETE /api/crops/:id
// @access  Private
exports.deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.isActive = false;
    await crop.save();

    res.status(200).json({
      success: true,
      message: 'Crop removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop health score
// @route   PUT /api/crops/:id/health
// @access  Private
exports.updateHealth = async (req, res, next) => {
  try {
    const { score, notes } = req.body;

    let crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Update current health score
    crop.healthScore = score;

    // Add to health history
    crop.healthHistory.push({
      date: new Date(),
      score,
      notes
    });

    await crop.save();

    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get crop analytics and trends
// @route   GET /api/crops/analytics/overview
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id, isActive: true });

    // Calculate statistics
    const totalCrops = crops.length;
    const avgHealth = crops.length > 0 
      ? crops.reduce((sum, c) => sum + c.healthScore, 0) / crops.length 
      : 0;

    const statusCounts = {};
    crops.forEach(c => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    const cropTypeCounts = {};
    crops.forEach(c => {
      cropTypeCounts[c.name] = (cropTypeCounts[c.name] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalCrops,
        averageHealth: Math.round(avgHealth),
        statusDistribution: statusCounts,
        cropTypeDistribution: cropTypeCounts,
        totalEstimatedYield: crops.reduce((sum, c) => sum + (c.yieldEstimate?.estimated || 0), 0),
        totalEstimatedProfit: crops.reduce((sum, c) => sum + (c.profitEstimate?.estimated || 0), 0)
      }
    });
  } catch (error) {
    next(error);
  }
};
