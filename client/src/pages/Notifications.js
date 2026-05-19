/**
 * Notifications Page
 * View, filter, and manage all user notifications
 */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Row, Col, Card, Button, Badge, Pagination } from "react-bootstrap";
import {
  RiBellLine,
  RiDeleteBin6Line,
  RiRefreshLine,
  RiVirusLine,
  RiCloudLine,
  RiTaskLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import notificationService from "../services/notificationService";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({
        limit: 100,
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({
        limit: 100,
      });
      setNotifications(response.data || []);
      toast.success("Notifications refreshed");
    } catch (error) {
      toast.error("Failed to refresh");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getIcon = (type) => {
    const size = 18;
    switch (type) {
      case "disease":
        return <RiVirusLine size={size} className="text-danger" />;
      case "weather":
        return <RiCloudLine size={size} className="text-info" />;
      case "task":
        return <RiTaskLine size={size} className="text-success" />;
      case "warning":
        return <RiAlertLine size={size} className="text-warning" />;
      case "success":
        return <RiCheckboxCircleLine size={size} className="text-success" />;
      case "error":
        return <RiErrorWarningLine size={size} className="text-danger" />;
      default:
        return <RiBellLine size={size} className="text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <DashboardLayout title="Notifications">
      <div className="notifications-container">
        {/* Stats */}
        <Row className="mb-4 g-3">
          <Col md={3} sm={6}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <small className="text-muted">Total</small>
                    <h4 className="mt-2 mb-0">{notifications.length}</h4>
                  </div>
                  <RiBellLine size={32} className="text-primary opacity-50" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <small className="text-muted">Unread</small>
                    <h4 className="mt-2 mb-0 text-danger">{unreadCount}</h4>
                  </div>
                  <Badge bg="danger" className="p-2">
                    {unreadCount}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Controls */}
        <Row className="mb-3">
          <Col md={9}></Col>
          <Col md={3}>
            <Button
              variant="outline-primary"
              size="sm"
              className="w-100"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RiRefreshLine className="me-2" />
              Refresh
            </Button>
          </Col>
        </Row>

        {/* Notifications List */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : paginatedNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted">No notifications</div>
            ) : (
              <div>
                {paginatedNotifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3 border-bottom d-flex justify-content-between align-items-start ${
                      !notif.isRead ? "bg-light" : ""
                    }`}
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        {getIcon(notif.type)}
                        <h6 className="mb-0 ms-2">{notif.title}</h6>
                        {!notif.isRead && (
                          <Badge bg="primary" className="ms-2">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="mb-1 text-muted small">{notif.message}</p>
                      <small className="text-muted">
                        {new Date(notif.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <div className="ms-3 d-flex gap-2">
                      {!notif.isRead && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMarkAsRead(notif._id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(notif._id)}
                      >
                        <RiDeleteBin6Line />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
