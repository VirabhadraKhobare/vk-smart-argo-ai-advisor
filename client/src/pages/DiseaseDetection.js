/**
 * Disease Detection Page
 * Upload crop images for AI disease identification with professional results display
 */
import React, { useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import {
  RiUploadCloudLine,
  RiImageLine,
  RiVirusLine,
  RiMedicineBottleLine,
  RiPlantLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import diseaseService from "../services/diseaseService";
import "./DiseaseDetection.css";

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    setLoading(true);
    try {
      const response = await diseaseService.detectDisease(selectedFile);
      setResult(response.data.data);
      toast.success("Disease detection complete");
    } catch (error) {
      toast.error("Detection failed. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout title="Disease Detection">
      <div className="animate-fade-in">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">AI Disease Detection</h4>
          <p className="text-muted mb-0">
            Upload crop images to identify diseases and get treatment
            recommendations
          </p>
        </div>

        {/* Main Layout: Upload Area (Full Width Initially) */}
        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="upload-card">
              <Card.Body>
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <RiUploadCloudLine className="me-2" style={{ color: "#2d5016" }} />
                  Upload Crop Image
                </h5>

                {/* Upload Zone */}
                <div
                  className={`upload-zone ${dragActive ? "upload-zone-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFile(e.target.files[0])
                    }
                    style={{ display: "none" }}
                  />
                  {preview ? (
                    <div className="position-relative w-100">
                      <img
                        src={preview}
                        alt="Preview"
                        className="upload-preview-image"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 rounded-circle delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setSelectedFile(null);
                          setResult(null);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="upload-icon">
                        <RiUploadCloudLine />
                      </div>
                      <h6 className="fw-bold mb-1">
                        Drop image here or click to upload
                      </h6>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Supports: JPG, PNG, WebP (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-100 mt-3 detect-btn"
                  disabled={!selectedFile || loading}
                  onClick={handleDetect}
                  style={{
                    background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem",
                  }}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" text="Analyzing..." />
                    </>
                  ) : (
                    <>
                      <RiVirusLine className="me-2" /> Detect Disease
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        </div>

        {/* Results Layout: Side-by-Side */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Row className="g-4">
                {/* Left: Image Preview */}
                <Col lg={5}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="image-display-card h-100">
                      <Card.Body className="d-flex flex-column">
                        <h6 className="fw-bold mb-3 text-center">Uploaded Image</h6>
                        <div className="image-container flex-grow-1 d-flex align-items-center justify-content-center">
                          <img
                            src={preview}
                            alt="Analyzed crop"
                            className="result-image"
                          />
                        </div>
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-muted d-block mb-2">
                            Image Analysis Details
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small">File Type: {selectedFile?.type.split("/")[1].toUpperCase()}</span>
                            <span className="small">Size: {(selectedFile?.size / 1024).toFixed(2)} KB</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>

                {/* Right: Disease Details */}
                <Col lg={7}>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="disease-details-card h-100">
                      <Card.Body>
                        {/* Header Section */}
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-2">Detection Results</h5>
                            <p className="text-muted small mb-0">
                              Analysis completed using AI Model
                            </p>
                          </div>
                          <Badge
                            className="severity-badge"
                            style={{
                              backgroundColor: getSeverityColor(result.severity),
                            }}
                          >
                            {result.severity.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Disease Name & Icon */}
                        <div className="disease-header-section mb-4 pb-3 border-bottom">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="disease-icon-large"
                              style={{
                                background: `linear-gradient(135deg, ${getSeverityColor(result.severity)}20, ${getSeverityColor(result.severity)}40)`,
                                color: getSeverityColor(result.severity),
                              }}
                            >
                              <RiVirusLine size={32} />
                            </div>
                            <div>
                              <h4
                                className="fw-bold mb-1"
                                style={{ color: getSeverityColor(result.severity) }}
                              >
                                {result.diseaseName}
                              </h4>
                              <div className="d-flex align-items-center">
                                <span className="small text-muted me-2">Confidence:</span>
                                <div className="confidence-display">
                                  <span className="fw-bold" style={{ color: getSeverityColor(result.severity) }}>
                                    {result.confidence}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Symptoms Section */}
                        {result.symptoms && result.symptoms.length > 0 && (
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                              <RiErrorWarningLine className="me-2" style={{ color: "#ffc107" }} />
                              Symptoms Identified
                            </h6>
                            <div className="symptoms-grid">
                              {result.symptoms.map((symptom, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  <span className="symptom-tag">
                                    {symptom}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Precautions Section */}
                        {result.precautions && result.precautions.length > 0 && (
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                              <RiPlantLine className="me-2" style={{ color: "#28a745" }} />
                              Precautions
                            </h6>
                            <div className="precautions-list">
                              {result.precautions.map((precaution, idx) => (
                                <motion.div
                                  key={idx}
                                  className="precaution-item"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  <RiCheckLine className="me-2" />
                                  <span>{precaution}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended Solutions */}
                        {result.treatment && (
                          <div>
                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                              <RiMedicineBottleLine className="me-2" style={{ color: "#dc3545" }} />
                              Recommended Solutions
                            </h6>

                            {result.treatment.immediate && result.treatment.immediate.length > 0 && (
                              <div className="solution-card solution-urgent mb-3">
                                <div className="solution-header">
                                  <span className="solution-label">Immediate Actions</span>
                                </div>
                                <div className="solution-content">
                                  {result.treatment.immediate.map((action, idx) => (
                                    <div key={idx} className="solution-item">
                                      <span className="solution-badge urgent">
                                        {action.urgency}
                                      </span>
                                      <span>{action.action}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.treatment.organic && result.treatment.organic.length > 0 && (
                              <div className="solution-card solution-organic mb-3">
                                <div className="solution-header">
                                  <span className="solution-label">Organic Remedies</span>
                                </div>
                                <div className="solution-content">
                                  {result.treatment.organic.map((remedy, idx) => (
                                    <div key={idx} className="solution-item">
                                      <strong>{remedy.remedy}:</strong>
                                      <span className="ms-2">{remedy.application}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.treatment.chemical && result.treatment.chemical.length > 0 && (
                              <div className="solution-card solution-chemical">
                                <div className="solution-header">
                                  <span className="solution-label">Chemical Treatment</span>
                                </div>
                                <div className="solution-content">
                                  {result.treatment.chemical.map((chem, idx) => (
                                    <div key={idx} className="solution-item">
                                      <strong>{chem.name}</strong>
                                      <small className="ms-2 text-muted">
                                        {chem.dosage} • {chem.application}
                                      </small>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Empty State */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="empty-state-card">
              <Card.Body className="empty-state-container">
                <div className="empty-state-icon">
                  <RiImageLine size={64} />
                </div>
                <h5 className="empty-state-title">No Image Analyzed Yet</h5>
                <p className="empty-state-text">
                  Upload a crop image above to get AI-powered disease detection and treatment recommendations
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DiseaseDetection;
