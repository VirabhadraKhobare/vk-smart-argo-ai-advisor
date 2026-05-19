/**
 * Yield Prediction Page
 * AI-powered yield and profit estimation
 */
import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { CustomBarChart } from "../components/Charts";
import { motion } from "framer-motion";
import { Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import {
  RiBarChartBoxLine,
  RiMoneyDollarCircleLine,
  RiSeedlingLine,
  RiWaterFlashLine,
  RiSunLine,
  RiEarthLine,
  RiCalculatorLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import yieldService from "../services/yieldService";

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    soilQuality: "good",
    rainfall: "",
    temperature: "",
    fertilizerUsed: true,
    irrigationType: "drip",
    area: "",
    areaUnit: "acres",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await yieldService.predict(formData);
      setPrediction(response.data);
      setHistory((prev) => [response.data, ...prev].slice(0, 5));
      toast.success("Yield prediction generated successfully");
    } catch (error) {
      toast.error("Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  const cropOptions = [
    "Sugarcane",
    "Wheat",
    "Rice",
    "Cotton",
    "Soybean",
    "Onion",
    "Tomato",
    "Potato",
    "Maize",
    "Barley",
    "Chickpea",
    "Mustard",
    "Groundnut",
  ];

  return (
    <DashboardLayout title="Yield Prediction">
      <div className="animate-fade-in">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">AI Yield Prediction</h4>
          <p className="text-muted mb-0">
            Predict your crop yield and expected profit using AI
          </p>
        </div>

        <Row className="g-4">
          {/* Input Form */}
          <Col lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <RiCalculatorLine /> Prediction Inputs
                  </h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Crop Type</Form.Label>
                      <Form.Select
                        value={formData.cropType}
                        onChange={(e) =>
                          setFormData({ ...formData, cropType: e.target.value })
                        }
                        required
                      >
                        <option value="">Select crop...</option>
                        {cropOptions.map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Soil Quality</Form.Label>
                          <Form.Select
                            value={formData.soilQuality}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                soilQuality: e.target.value,
                              })
                            }
                          >
                            <option value="poor">Poor</option>
                            <option value="fair">Fair</option>
                            <option value="good">Good</option>
                            <option value="excellent">Excellent</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Area (Acres)</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.area}
                            onChange={(e) =>
                              setFormData({ ...formData, area: e.target.value })
                            }
                            placeholder="Enter area"
                            required
                            min="0.1"
                            step="0.1"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Annual Rainfall (mm)</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.rainfall}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                rainfall: e.target.value,
                              })
                            }
                            placeholder="e.g., 800"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Avg Temperature (°C)</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.temperature}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                temperature: e.target.value,
                              })
                            }
                            placeholder="e.g., 25"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Irrigation Type</Form.Label>
                          <Form.Select
                            value={formData.irrigationType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                irrigationType: e.target.value,
                              })
                            }
                          >
                            <option value="drip">Drip</option>
                            <option value="sprinkler">Sprinkler</option>
                            <option value="flood">Flood</option>
                            <option value="rain-fed">Rain-fed</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fertilizer Used</Form.Label>
                          <Form.Select
                            value={formData.fertilizerUsed ? "true" : "false"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fertilizerUsed: e.target.value === "true",
                              })
                            }
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      className="w-100"
                      disabled={loading}
                      style={{
                        background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                        border: "none",
                        borderRadius: "12px",
                        padding: "0.75rem",
                      }}
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" text="Predicting..." />
                      ) : (
                        <>
                          <RiCalculatorLine className="me-2" /> Predict Yield
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Results */}
          <Col lg={7}>
            {prediction ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Card
                      className="text-center h-100"
                      style={{
                        background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                      }}
                    >
                      <Card.Body>
                        <RiBarChartBoxLine
                          size={40}
                          style={{ color: "#2d5016" }}
                          className="mb-2"
                        />
                        <h6 className="text-muted">Estimated Yield</h6>
                        <h2 className="fw-bold" style={{ color: "#2d5016" }}>
                          {prediction.estimatedYield} {prediction.unit}
                        </h2>
                        <Badge bg="success" className="rounded-pill">
                          {prediction.confidence}% confidence
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card
                      className="text-center h-100"
                      style={{
                        background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                      }}
                    >
                      <Card.Body>
                        <RiMoneyDollarCircleLine
                          size={40}
                          style={{ color: "#e65100" }}
                          className="mb-2"
                        />
                        <h6 className="text-muted">Expected Profit</h6>
                        <h2 className="fw-bold" style={{ color: "#e65100" }}>
                          ₹{prediction.profitEstimate?.toLocaleString()}
                        </h2>
                        <Badge
                          bg="warning"
                          text="dark"
                          className="rounded-pill"
                        >
                          Est. {prediction.marketPricePerUnit?.toLocaleString()}
                          /ton
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Environmental Conditions */}
                <Card className="mb-3">
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Environmental Conditions</h6>
                    <Row className="g-3">
                      <Col md={4}>
                        <div
                          className="d-flex align-items-center p-3 rounded"
                          style={{ background: "#e3f2fd" }}
                        >
                          <RiWaterFlashLine
                            size={32}
                            style={{ color: "#1976d2", marginRight: "12px" }}
                          />
                          <div>
                            <p className="mb-1 text-muted small">Rainfall</p>
                            <h6 className="fw-bold mb-0">
                              {prediction.inputData?.rainfall}mm
                            </h6>
                          </div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div
                          className="d-flex align-items-center p-3 rounded"
                          style={{ background: "#fff3e0" }}
                        >
                          <RiSunLine
                            size={32}
                            style={{ color: "#f57c00", marginRight: "12px" }}
                          />
                          <div>
                            <p className="mb-1 text-muted small">Temperature</p>
                            <h6 className="fw-bold mb-0">
                              {prediction.inputData?.temperature}°C
                            </h6>
                          </div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div
                          className="d-flex align-items-center p-3 rounded"
                          style={{ background: "#f3e5f5" }}
                        >
                          <RiEarthLine
                            size={32}
                            style={{ color: "#7b1fa2", marginRight: "12px" }}
                          />
                          <div>
                            <p className="mb-1 text-muted small">
                              Soil Quality
                            </p>
                            <h6 className="fw-bold mb-0 text-capitalize">
                              {prediction.inputData?.soilQuality}
                            </h6>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Recommendations */}
                {prediction.recommendations?.length > 0 && (
                  <Card className="mb-3">
                    <Card.Body>
                      <h6 className="fw-bold mb-3">AI Recommendations</h6>
                      {prediction.recommendations.map((rec, idx) => (
                        <Alert
                          key={idx}
                          variant="info"
                          className="mb-2 py-2"
                          style={{ borderRadius: "10px" }}
                        >
                          <RiSeedlingLine className="me-2" />
                          {rec}
                        </Alert>
                      ))}
                    </Card.Body>
                  </Card>
                )}

                {/* Input Summary */}
                <Card>
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Prediction Parameters</h6>
                    <Row className="g-2">
                      {Object.entries(prediction.inputData || {}).map(
                        ([key, value]) => (
                          <Col md={6} key={key}>
                            <div
                              className="d-flex justify-content-between p-2 rounded"
                              style={{ background: "#f8f9fa" }}
                            >
                              <span className="text-muted text-capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="fw-medium">
                                {typeof value === "boolean"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : value}
                              </span>
                            </div>
                          </Col>
                        ),
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            ) : (
              <Card
                className="h-100 d-flex align-items-center justify-content-center"
                style={{ minHeight: 400 }}
              >
                <Card.Body className="text-center text-muted">
                  <RiCalculatorLine
                    size={64}
                    className="mb-3"
                    style={{ opacity: 0.3 }}
                  />
                  <h5>Enter crop details to get AI prediction</h5>
                  <p>
                    Our AI model will analyze your inputs and provide yield
                    estimates
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Prediction History */}
        {history.length > 0 && (
          <Card className="mt-4">
            <Card.Body>
              <h5 className="fw-bold mb-4">Prediction Analytics</h5>

              {/* Chart Visualization */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4"
                >
                  <h6 className="text-muted mb-3">Yield Trend</h6>
                  <CustomBarChart
                    data={{
                      labels: history.map((_, idx) => `Prediction ${idx + 1}`),
                      datasets: [
                        {
                          label: "Est. Yield (tons)",
                          data: history.map((pred) => pred.estimatedYield),
                          backgroundColor: "rgba(45, 80, 22, 0.6)",
                          borderColor: "#2d5016",
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </motion.div>
              )}

              {/* Profit Trend */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4"
                >
                  <h6 className="text-muted mb-3">Profit Estimate Trend</h6>
                  <CustomBarChart
                    data={{
                      labels: history.map((_, idx) => `Prediction ${idx + 1}`),
                      datasets: [
                        {
                          label: "Est. Profit (₹)",
                          data: history.map((pred) => pred.profitEstimate),
                          backgroundColor: "rgba(230, 81, 0, 0.6)",
                          borderColor: "#e65100",
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </motion.div>
              )}

              {/* Recent Predictions Table */}
              <h6 className="fw-bold mb-3 mt-4">Recent Predictions</h6>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Crop</th>
                      <th>Area</th>
                      <th>Soil</th>
                      <th>Est. Yield</th>
                      <th>Est. Profit</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((pred, idx) => (
                      <tr key={idx}>
                        <td className="fw-medium">
                          {pred.inputData?.cropType}
                        </td>
                        <td>
                          {pred.inputData?.area} {pred.inputData?.areaUnit}
                        </td>
                        <td>
                          <Badge bg="light" text="dark">
                            {pred.inputData?.soilQuality}
                          </Badge>
                        </td>
                        <td className="fw-bold" style={{ color: "#2d5016" }}>
                          {pred.estimatedYield} tons
                        </td>
                        <td className="fw-bold" style={{ color: "#e65100" }}>
                          ₹{pred.profitEstimate?.toLocaleString()}
                        </td>
                        <td>
                          <Badge bg="success">{pred.confidence}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default YieldPrediction;
