# 📢 Notifications System - Complete Guide

## Overview

The Notifications system provides a centralized way to manage all alerts and messages for farmers. It integrates with all parts of the Smart Agro AI Advisor application.

---

## Features

### ✅ Core Features
- **Real-time Notifications**: Create, retrieve, filter, and manage notifications
- **Multiple Categories**: Disease, Weather, Crop, Soil, Market, Task, Community, System
- **Priority Levels**: Low, Medium, High with visual indicators
- **Notification Types**: Info, Warning, Success, Error, Disease, Weather, Task
- **Read/Unread Status**: Track which notifications users have seen
- **Bulk Actions**: Mark multiple as read, delete selected notifications
- **Pagination**: Handle large volumes of notifications efficiently
- **Filtering**: Filter by category, read status, priority, type
- **Search**: Find specific notifications easily

### 🎨 User Experience
- **Stat Cards**: Display total, unread, read, and selected counts
- **Color-Coded**: Visual indicators for priority and status
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion transitions
- **Clear Actions**: Mark read, delete, select with confirmation
- **Timestamps**: Know exactly when each notification was created
- **Icons**: Category-specific icons for quick identification

---

## Frontend - Notifications Page

### Location
`client/src/pages/Notifications.js`

### Components Used
- React Bootstrap: Cards, Badges, Forms, Pagination, Alerts
- Framer Motion: Animations
- React Icons: Category and action icons
- React Toastify: Toast notifications

### Key Functions

#### Fetch Notifications
```javascript
const fetchNotifications = useCallback(async () => {
  const params = {};
  if (filterCategory) params.category = filterCategory;
  if (filterReadStatus !== 'all') {
    params.isRead = filterReadStatus === 'read';
  }
  const response = await notificationService.getNotifications(params);
  setNotifications(response.data || []);
}, [filterCategory, filterReadStatus]);
```

#### Mark as Read
```javascript
const handleMarkAsRead = async (id) => {
  await notificationService.markAsRead(id);
  setNotifications(prev => 
    prev.map(n => n._id === id ? { ...n, isRead: true } : n)
  );
  toast.success('Marked as read');
};
```

#### Delete Notification
```javascript
const handleDeleteNotification = async (id) => {
  if (!window.confirm('Delete this notification?')) return;
  await notificationService.deleteNotification(id);
  setNotifications(prev => prev.filter(n => n._id !== id));
  toast.success('Notification deleted');
};
```

#### Bulk Delete
```javascript
const handleDeleteSelected = async () => {
  for (const id of selectedNotifications) {
    await notificationService.deleteNotification(id);
  }
  setSelectedNotifications(new Set());
  toast.success('Notifications deleted');
};
```

---

## Backend - Notification Service

### Model
**File**: `server/models/Notification.js`

```javascript
{
  user: ObjectId,           // Reference to User
  title: String,            // Notification title
  message: String,          // Notification message
  type: String,             // info, warning, success, error, disease, weather, task
  category: String,         // crop, soil, weather, disease, market, task, system, community
  isRead: Boolean,          // Read status
  actionUrl: String,        // Optional URL to navigate to
  priority: String,         // low, medium, high
  relatedId: ObjectId,      // Reference to related document
  relatedModel: String,     // Model name (Crop, SoilReport, etc.)
  createdAt: Date,
  updatedAt: Date
}
```

### Controller
**File**: `server/controllers/notificationController.js`

#### Get Notifications
```javascript
exports.getNotifications = async (req, res, next) => {
  const { isRead, category, limit = 20 } = req.query;
  
  let query = { user: req.user.id };
  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (category) query.category = category;

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('relatedId');

  const unreadCount = await Notification.countDocuments({ 
    user: req.user.id, 
    isRead: false 
  });

  res.json({ success: true, count, unreadCount, data: notifications });
};
```

#### Mark as Read
```javascript
exports.markAsRead = async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  notification.isRead = true;
  await notification.save();
  res.json({ success: true, data: notification });
};
```

#### Mark All as Read
```javascript
exports.markAllAsRead = async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );
  res.json({ success: true, message: 'All marked as read' });
};
```

#### Delete Notification
```javascript
exports.deleteNotification = async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  await notification.deleteOne();
  res.json({ success: true, message: 'Deleted' });
};
```

#### Delete All Notifications
```javascript
exports.deleteAllNotifications = async (req, res, next) => {
  const result = await Notification.deleteMany({ user: req.user.id });
  res.json({ 
    success: true, 
    message: `${result.deletedCount} deleted`,
    deletedCount: result.deletedCount 
  });
};
```

#### Create Notification (Internal)
```javascript
exports.createNotification = async (userId, data) => {
  try {
    const notification = await Notification.create({
      user: userId,
      ...data
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
```

### Routes
**File**: `server/routes/notificationRoutes.js`

```javascript
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
router.delete('/clear-all', protect, deleteAllNotifications);
```

---

## Frontend - Notification Service

**File**: `client/src/services/notificationService.js`

```javascript
const notificationService = {
  // Get notifications with filters
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications?isRead=false&limit=1000');
    return response.data;
  },

  // Mark specific notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  },

  // Get notifications by category
  getNotificationsByCategory: async (category) => {
    const response = await api.get('/notifications', {
      params: { category, limit: 100 }
    });
    return response.data;
  }
};
```

---

## How to Generate Notifications

### Example: Create a Disease Alert Notification

In any controller (e.g., `diseaseController.js`):

```javascript
const { createNotification } = require('../controllers/notificationController');

exports.detectDisease = async (req, res, next) => {
  try {
    // ... detection logic ...

    const diseaseAlert = await DiseaseAlert.create({
      farmer: req.user.id,
      // ... other fields
    });

    // Create notification for user
    await createNotification(req.user.id, {
      title: '🦠 Disease Detected!',
      message: `High confidence detection of ${diseaseAlert.detectionResult.diseaseName} on your farm.`,
      type: 'disease',
      category: 'disease',
      priority: diseaseAlert.detectionResult.severity === 'critical' ? 'high' : 'medium',
      actionUrl: '/disease-detection',
      relatedId: diseaseAlert._id,
      relatedModel: 'DiseaseAlert'
    });

    res.json({ success: true, data: diseaseAlert });
  } catch (error) { next(error); }
};
```

### Example: Weather Alert Notification

```javascript
// In weatherController.js
await createNotification(req.user.id, {
  title: '☔ Heavy Rain Expected',
  message: 'Heavy rainfall expected in next 48 hours. Avoid spraying.',
  type: 'warning',
  category: 'weather',
  priority: 'high',
  actionUrl: '/weather'
});
```

### Example: Market Price Notification

```javascript
// In priceController.js
await createNotification(req.user.id, {
  title: '💰 Price Alert',
  message: 'Wheat prices up 5% in your region!',
  type: 'success',
  category: 'market',
  priority: 'low',
  actionUrl: '/market-prices'
});
```

### Example: Task Reminder Notification

```javascript
// In taskController.js
await createNotification(req.user.id, {
  title: '📋 Task Reminder',
  message: 'Time to apply fertilizer for better yield.',
  type: 'info',
  category: 'task',
  priority: 'medium',
  actionUrl: '/crop-analysis'
});
```

---

## Navigation

### Access the Notifications Page
1. Click "Notifications" in the sidebar under COMMUNITY section
2. Or navigate to `/notifications` route directly

### Filter Notifications
- **By Category**: Select from dropdown (Disease, Weather, Crop, etc.)
- **By Status**: All, Unread Only, Read Only
- **Quick Actions**: Refresh button

### Manage Notifications
- **Mark as Read**: Click checkmark icon
- **Delete**: Click X icon
- **Select Multiple**: Use checkboxes
- **Delete Selected**: Click "Delete Selected" button
- **Mark All as Read**: Click "Mark All Read" button

---

## API Endpoints

### GET /notifications
Get all notifications with optional filters

**Query Parameters:**
- `isRead`: true/false (optional)
- `category`: category name (optional)
- `limit`: number per page (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 15,
  "unreadCount": 3,
  "data": [
    {
      "_id": "...",
      "user": "...",
      "title": "Disease Alert",
      "message": "Detected on crop",
      "type": "disease",
      "category": "disease",
      "priority": "high",
      "isRead": false,
      "createdAt": "2024-05-13T10:30:00Z"
    }
  ]
}
```

### PUT /notifications/:id/read
Mark specific notification as read

### PUT /notifications/read-all
Mark all notifications as read

### DELETE /notifications/:id
Delete specific notification

### DELETE /notifications/clear-all
Delete all notifications

---

## Best Practices

### For Developers
1. **Always include context**: Make notification messages informative and actionable
2. **Set correct priority**: Use high for urgent alerts, medium for important, low for FYI
3. **Use actionUrl**: Help users navigate to relevant feature
4. **Include category**: Helps users filter and organize
5. **Link to related data**: Use relatedId to connect to source

### For Users
1. **Regular review**: Check notifications daily for important alerts
2. **Mark as read**: Keep unread count low for better UX
3. **Delete old**: Remove notifications you don't need anymore
4. **Set preferences**: (Future feature) Configure which notifications to receive

---

## Future Enhancements

- 🔔 **Push Notifications**: Browser notifications
- 📧 **Email Notifications**: Important alerts via email
- 📱 **Mobile App**: Native mobile notifications
- ⚙️ **Notification Preferences**: User controls what they receive
- 🔍 **Search**: Full-text search in notifications
- 📊 **Analytics**: Notification read rates and engagement
- ⏰ **Scheduled**: Schedule notifications for later
- 🌍 **Multi-language**: Notifications in different languages
- 🎯 **Targeted**: Location/crop-specific notifications
- 👥 **Group Notifications**: Combine similar notifications

---

## Troubleshooting

### Notifications not appearing
- Check internet connection
- Verify backend is running
- Check browser console for errors
- Clear browser cache

### Can't delete notifications
- Ensure you're logged in
- Check if notification belongs to your account
- Verify API endpoint is accessible

### Notifications slow to load
- Check database performance
- Consider archiving old notifications
- Reduce limit parameter

### Email notifications not working
- Configure SMTP settings in .env
- Verify email service is running
- Check spam folder

---

## Support

For issues or feature requests:
- Check server logs: `server/logs/`
- Check browser console for errors
- Verify all dependencies are installed
- Contact development team

---

**Happy Farming! 🌾**

The notification system helps you stay informed about all important farm updates and alerts.
