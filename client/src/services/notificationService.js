/**
 * Notification Service
 * User notification API calls
 */
import api from "./api";

const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications?isRead=false&limit=1000");
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  deleteAllNotifications: async () => {
    const response = await api.delete("/notifications/clear-all");
    return response.data;
  },

  getNotificationsByCategory: async (category) => {
    const response = await api.get("/notifications", {
      params: { category, limit: 100 },
    });
    return response.data;
  },
};

export default notificationService;
