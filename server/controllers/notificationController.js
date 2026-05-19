/**
 * Notification Controller
 * Manages user notifications and alerts
 */
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res, next) => {
  try {
    const { isRead, category, limit = 20 } = req.query;

    let query = { user: req.user.id };
    if (isRead !== undefined) query.isRead = isRead === "true";
    if (category) query.category = category;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("relatedId");

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true },
    );

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    await notification.deleteOne();
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

exports.deleteAllNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({ user: req.user.id });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notification(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Create notification (internal use)
exports.createNotification = async (userId, data) => {
  try {
    const notification = await Notification.create({
      user: userId,
      ...data,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
