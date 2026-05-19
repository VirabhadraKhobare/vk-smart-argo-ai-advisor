/**
 * Disease Alerts History Page
 * View, manage, and track all disease detection alerts
 */
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Form,
  Pagination,
} from "react-bootstrap";
import { RiVirusLine, RiHistoryLine, RiFilter3Line } from "react-icons/ri";
import { toast } from "react-toastify";
import diseaseService from "../services/diseaseService";

const DiseaseAlertsHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const itemsPerPage = 10;

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await diseaseService.getAlerts(
        filterStatus || undefined,
      );
      setAlerts(response.data || []);
    } catch (error) {
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      await diseaseService.updateStatus(alertId, newStatus);
      toast.success(`Alert marked as ${newStatus}`);
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to update alert");
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "#28a745",
      medium: "#ffc107",
      high: "#ff9800",
      critical: "#dc3545",
    };
    return colors[severity] || "#6c757d";
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      active: "danger",
      treating: "warning",
      resolved: "success",
    };
    return variants[status] || "secondary";
  };

  // Pagination logic
  const filteredAlerts = alerts.filter(
    (alert) => !filterStatus || alert.status === filterStatus,
  );
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  return (
    <DashboardLayout title="Disease Alerts History">
      <div className="animate-fade-in">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Disease Alerts Management</h4>
          <p className="text-muted mb-0">
            Track and manage all disease detection alerts from your crops
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Filter by Status</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="treating">Treating</option>
                    <option value="resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Button
                  variant="outline-success"
                  onClick={fetchAlerts}
                  className="w-100"
                >
                  <RiFilter3Line className="me-2" /> Refresh Alerts
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Alerts Summary */}
        <Row className="mb-4">
          <Col lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="text-center">
                <Card.Body>
                  <h3 className="fw-bold" style={{ color: "#dc3545" }}>
                    {alerts.filter((a) => a.status === "active").length}
                  </h3>
                  <p className="text-muted mb-0">Active Alerts</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center">
                <Card.Body>
                  <h3 className="fw-bold" style={{ color: "#ffc107" }}>
                    {alerts.filter((a) => a.status === "treating").length}
                  </h3>
                  <p className="text-muted mb-0">Under Treatment</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center">
                <Card.Body>
                  <h3 className="fw-bold" style={{ color: "#28a745" }}>
                    {alerts.filter((a) => a.status === "resolved").length}
                  </h3>
                  <p className="text-muted mb-0">Resolved</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="text-center">
                <Card.Body>
                  <h3 className="fw-bold">{alerts.length}</h3>
                  <p className="text-muted mb-0">Total Alerts</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Alerts List */}
        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <p className="text-muted">Loading alerts...</p>
              </div>
            ) : paginatedAlerts.length > 0 ? (
              <AnimatePresence mode="wait">
                {paginatedAlerts.map((alert, idx) => (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="mb-3 p-3 border rounded-3"
                    style={{
                      borderColor: getSeverityColor(
                        alert.detectionResult?.severity,
                      ),
                    }}
                  >
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: "50%",
                              background: `${getSeverityColor(alert.detectionResult?.severity)}20`,
                              color: getSeverityColor(
                                alert.detectionResult?.severity,
                              ),
                            }}
                          >
                            <RiVirusLine size={24} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1">
                              {alert.detectionResult?.diseaseName}
                              <Badge
                                style={{
                                  backgroundColor: getSeverityColor(
                                    alert.detectionResult?.severity,
                                  ),
                                }}
                                className="ms-2 rounded-pill"
                              >
                                {alert.detectionResult?.severity?.toUpperCase()}
                              </Badge>
                            </h6>
                            <p
                              className="text-muted mb-1"
                              style={{ fontSize: "0.9rem" }}
                            >
                              <RiHistoryLine className="me-1" />
                              {new Date(
                                alert.detectedAt,
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(alert.detectedAt).toLocaleTimeString()}
                            </p>
                            <p
                              className="text-muted mb-0"
                              style={{ fontSize: "0.85rem" }}
                            >
                              Confidence:{" "}
                              <strong>
                                {alert.detectionResult?.confidence}%
                              </strong>{" "}
                              |{alert.crop?.name && ` Crop: ${alert.crop.name}`}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <Badge
                          bg={getStatusBadgeVariant(alert.status)}
                          className="mb-2 me-2"
                        >
                          {alert.status?.toUpperCase()}
                        </Badge>
                        <br />
                        {alert.status === "active" && (
                          <>
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                handleStatusUpdate(alert._id, "treating")
                              }
                              className="me-2 mb-2"
                            >
                              Mark Treating
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleStatusUpdate(alert._id, "resolved")
                              }
                              className="mb-2"
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {alert.status === "treating" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              handleStatusUpdate(alert._id, "resolved")
                            }
                            className="mb-2"
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => setSelectedAlert(alert)}
                          className="ms-2 mb-2"
                        >
                          View Details
                        </Button>
                      </Col>
                    </Row>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <Alert variant="info" className="mb-0">
                <strong>No alerts found.</strong> Upload crop images for disease
                detection to generate alerts.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
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

        {/* Alert Details Modal (simplified) */}
        <AnimatePresence>
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlert(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3 p-4"
                style={{ maxWidth: 600, maxHeight: "80vh", overflow: "auto" }}
              >
                <h5 className="fw-bold mb-3">
                  {selectedAlert.detectionResult?.diseaseName}
                </h5>
                <p>
                  <strong>Severity:</strong>{" "}
                  {selectedAlert.detectionResult?.severity}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {selectedAlert.detectionResult?.confidence}%
                </p>
                {selectedAlert.symptoms?.length > 0 && (
                  <>
                    <h6 className="fw-bold mt-3">Symptoms:</h6>
                    <ul>
                      {selectedAlert.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
                <Button
                  variant="secondary"
                  onClick={() => setSelectedAlert(null)}
                  className="w-100 mt-3"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default DiseaseAlertsHistory;
