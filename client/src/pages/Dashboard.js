/**
 * Dashboard Page
 * Main dashboard with widgets, charts, and AI recommendations
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { HealthTrendChart } from "../components/Charts";
import { motion } from "framer-motion";
import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
  RiPlantLine,
  RiDropLine,
  RiBarChartBoxLine,
  RiCloudLine,
  RiVirusLine,
  RiCalendarLine,
  RiAlertLine,
  RiMapPinLine,
  RiWaterFlashLine,
  RiWindyLine,
  RiArrowRightSLine,
  RiHeartLine,
  RiRobot2Line,
  RiTeamLine,
  RiLeafLine,
  RiSendPlane2Line,
  RiUserLine,
} from "react-icons/ri";
import cropService from "../services/cropService";
import weatherService from "../services/weatherService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cropHealth: 82,
    irrigationStatus: "Good",
    estimatedYield: "4.2T",
    estimatedProfit: "₹1.8L",
  });
  const [weather, setWeather] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeCrops, setActiveCrops] = useState([]);
  const [healthHistory, setHealthHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data in parallel
      const [analyticsRes, weatherRes] = await Promise.all([
        cropService.getAnalytics().catch(() => null),
        weatherService.getCurrent().catch(() => null),
      ]);

      // Update stats from analytics
      if (analyticsRes?.data) {
        setStats((prev) => ({
          ...prev,
          cropHealth: analyticsRes.data.averageHealth || 82,
          estimatedYield: `${analyticsRes.data.totalEstimatedYield?.toFixed(1) || "4.2"}T`,
          estimatedProfit: `₹${(analyticsRes.data.totalEstimatedProfit / 100000)?.toFixed(1) || "1.8"}L`,
        }));
      }

      // Weather data
      if (weatherRes?.data) {
        setWeather(weatherRes.data);
      }

      // Mock tasks based on soil data
      const mockTasks = [
        {
          id: 1,
          title: "Apply Potassium Fertilizer",
          description: "K levels below optimal — apply 20kg/acre today",
          priority: "high",
          icon: RiPlantLine,
        },
        {
          id: 2,
          title: "Inspect Field Block C",
          description: "Early signs of leaf blight detected by AI scan",
          priority: "medium",
          icon: RiVirusLine,
        },
        {
          id: 3,
          title: "Adjust Drip Irrigation",
          description: "Rain expected tomorrow — reduce water by 30%",
          priority: "low",
          icon: RiDropLine,
        },
      ];
      setTasks(mockTasks);

      // Mock active crops
      const mockCrops = [
        { name: "Sugarcane", health: 82, color: "#4a7c2a" },
        { name: "Soybean", health: 74, color: "#ff9800" },
        { name: "Onion", health: 91, color: "#17a2b8" },
        { name: "Cotton", health: 58, color: "#dc3545" },
      ];
      setActiveCrops(mockCrops);

      // Health history for chart
      const mockHistory = [
        { name: "Wk1", value: 68 },
        { name: "Wk2", value: 71 },
        { name: "Wk3", value: 69 },
        { name: "Wk4", value: 74 },
        { name: "Wk5", value: 77 },
        { name: "Wk6", value: 75 },
        { name: "Wk7", value: 80 },
        { name: "Wk8", value: 82 },
      ];
      setHealthHistory(mockHistory);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading dashboard..." />;

  return (
    <DashboardLayout title="Dashboard">
      <div className="animate-fade-in">
        {/* Stats Row with Active Alerts */}
        <Row className="g-3 mb-4">
          <Col xl={3} md={6}>
            <StatCard
              label="Crop Health"
              value={`${stats.cropHealth}%`}
              change="5% from last week"
              changeType="positive"
              icon={RiPlantLine}
              iconColor="green"
              delay={0}
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              label="Irrigation Status"
              value={stats.irrigationStatus}
              change="Optimal moisture"
              changeType="positive"
              icon={RiDropLine}
              iconColor="blue"
              delay={0.1}
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              label="Est. Yield"
              value={stats.estimatedYield}
              change="12% above avg"
              changeType="positive"
              icon={RiBarChartBoxLine}
              iconColor="orange"
              delay={0.2}
            />
          </Col>
          <Col xl={3} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="stat-card stat-card-alerts">
                <div className="stat-card-icon stat-card-icon-red">
                  <RiAlertLine />
                </div>
                <div className="stat-card-label">Active Alerts</div>
                <div className="stat-card-value">3</div>
                <div className="stat-card-change stat-card-change-negative">
                  <RiAlertLine />
                  Action Required
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Main Content Row with Chat and Tasks */}
        <Row className="g-4">
          {/* Health Trend Chart */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-100">
                <Card.Body>
                  <div className="chart-header">
                    <div className="d-flex align-items-center gap-2">
                      <RiPlantLine style={{ color: "#4a7c2a" }} />
                      <h5 className="chart-title mb-0">Crop Health Trend</h5>
                    </div>
                    <Badge bg="success" className="rounded-pill">
                      Healthy
                    </Badge>
                  </div>
                  <p
                    className="text-muted mb-3"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Last 8 weeks · Sugarcane
                  </p>
                  <HealthTrendChart data={healthHistory} />
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Today's Tasks + AI Assistant Stack */}
          <Col lg={4}>
            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <Card>
                <Card.Body>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <RiCalendarLine style={{ color: "#4a7c2a" }} />
                    <h5 className="mb-0 fw-semibold">Today's Tasks</h5>
                  </div>
                  <p
                    className="text-muted mb-3"
                    style={{ fontSize: "0.85rem" }}
                  >
                    AI-generated action plan
                  </p>
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="task-item"
                    >
                      <div className="task-number">{task.id}</div>
                      <div className="task-content">
                        <h6 className="mb-1">{task.title}</h6>
                        <p>{task.description}</p>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="link"
                    className="p-0 mt-2"
                    onClick={() => navigate("/notifications")}
                  >
                    View all Tasks <RiArrowRightSLine />
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>

            {/* AI Farm Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Card className="ai-assistant-card">
                <Card.Body>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <RiRobot2Line
                      style={{ color: "#4a7c2a", fontSize: "1.3rem" }}
                    />
                    <h5 className="mb-0 fw-semibold">AI Farm Assistant</h5>
                  </div>
                  <div className="ai-suggestion">
                    <div className="ai-icon">🌾</div>
                    <div>
                      <h6 className="mb-2">
                        Which crop is best for this season?
                      </h6>
                      <p className="mb-3">
                        Based on current weather, soil health and moisture
                        levels, I recommend Sugarcane or Maize for ideal yield
                        and profit.
                      </p>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => navigate("/ai-assistant")}
                      >
                        Get Suggestion
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="ms-2"
                        onClick={() => navigate("/disease-detection")}
                      >
                        Disease Help
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Weather and My Crops Section */}
        <Row className="g-4 mt-2">
          {/* Weather Card */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card
                className="h-100 weather-card"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <RiCloudLine />
                      <h5 className="mb-0 fw-semibold">Today's Weather</h5>
                    </div>
                    <Badge bg="light" text="dark" className="rounded-pill">
                      <RiMapPinLine className="me-1" />
                      Pune, MH
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div className="weather-temp">
                      {weather?.current?.temperature || 28}°C
                    </div>
                    <div>
                      <div className="weather-condition">
                        {weather?.current?.condition || "Partly Cloudy"}
                      </div>
                      <div
                        className="d-flex gap-3 mt-2"
                        style={{ fontSize: "0.9rem", opacity: 0.9 }}
                      >
                        <span>
                          <RiWaterFlashLine className="me-1" />
                          {weather?.current?.humidity || 68}%
                        </span>
                        <span>
                          <RiWindyLine className="me-1" />
                          {weather?.current?.windSpeed || 14} km/h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 7 Day Forecast */}
                  <div className="weather-forecast">
                    {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, idx) => (
                        <div key={idx} className="forecast-item">
                          <div className="forecast-day">{day}</div>
                          <div className="forecast-icon">☀️</div>
                          <div className="forecast-temps">
                            <span>30°</span>
                            <span>22°</span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <Button
                    variant="light"
                    size="sm"
                    className="mt-3 w-100"
                    onClick={() => navigate("/weather")}
                  >
                    View 7-Day Forecast
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* My Crops Table */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <RiPlantLine style={{ color: "#4a7c2a" }} />
                      <h5 className="mb-0 fw-semibold">My Crops</h5>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0"
                      onClick={() => navigate("/crop-analysis")}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="crops-table">
                    <div className="crop-row crop-row-header">
                      <div className="crop-name">Crop</div>
                      <div className="crop-health">Health</div>
                      <div className="crop-stage">Stage</div>
                      <div className="crop-action">Last Irrigated</div>
                      <div className="crop-details">Details</div>
                    </div>
                    {activeCrops.map((crop, idx) => (
                      <div key={idx} className="crop-row">
                        <div className="crop-name">
                          <RiPlantLine
                            style={{ marginRight: "8px", color: crop.color }}
                          />
                          {crop.name}
                        </div>
                        <div className="crop-health">
                          <span style={{ color: crop.color, fontWeight: 600 }}>
                            {crop.health}%
                          </span>
                        </div>
                        <div className="crop-stage">
                          {[
                            "Tillering",
                            "Flowering",
                            "Vegetative",
                            "Bulk Formation",
                          ][idx] || "Flowering"}
                        </div>
                        <div className="crop-action">
                          {[
                            "2 days ago",
                            "1 day ago",
                            "3 days ago",
                            "4 days ago",
                          ][idx] || "2 days ago"}
                        </div>
                        <div className="crop-details">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0"
                            onClick={() => navigate("/crop-analysis")}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 mb-4"
        >
          <h5 className="fw-semibold mb-3">Quick Actions</h5>
          <Row className="g-3">
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/crop-analysis")}
              >
                <div className="action-icon">
                  <RiPlantLine />
                </div>
                <div className="action-name">Add Crop</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/soil-health")}
              >
                <div className="action-icon">
                  <RiUserLine />
                </div>
                <div className="action-name">Soil Test</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/disease-detection")}
              >
                <div className="action-icon">
                  <RiVirusLine />
                </div>
                <div className="action-name">Detect Disease</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/yield-prediction")}
              >
                <div className="action-icon">
                  <RiBarChartBoxLine />
                </div>
                <div className="action-name">Market Prices</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/weather")}
              >
                <div className="action-icon">
                  <RiDropLine />
                </div>
                <div className="action-name">Irrigation</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/weather")}
              >
                <div className="action-icon">
                  <RiCloudLine />
                </div>
                <div className="action-name">Weather</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/soil-health")}
              >
                <div className="action-icon">
                  <RiLeafLine />
                </div>
                <div className="action-name">View Record</div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div
                className="quick-action-card"
                onClick={() => navigate("/ai-assistant")}
              >
                <div className="action-icon">
                  <RiSendPlane2Line />
                </div>
                <div className="action-name">Share Report</div>
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Community Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-4"
        >
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <RiTeamLine
                    style={{ color: "#4a7c2a", fontSize: "1.3rem" }}
                  />
                  <h5 className="mb-0 fw-semibold">Community Discussions</h5>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  onClick={() => navigate("/community")}
                >
                  View All
                </Button>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <div className="discussion-item">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="avatar-sm">RP</div>
                      <div>
                        <div className="discussion-author">Ramesh Patil</div>
                        <div className="discussion-meta">Badshapur, MP</div>
                      </div>
                    </div>
                    <div className="discussion-text">
                      "Has anyone faced late blight in sugarcane? Please share
                      your solutions."
                    </div>
                    <div className="discussion-stats">
                      <span>
                        <RiHeartLine className="me-1" /> 12
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="discussion-item">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div
                        className="avatar-sm"
                        style={{ backgroundColor: "#ff9800" }}
                      >
                        PK
                      </div>
                      <div>
                        <div className="discussion-author">Priya Kumar</div>
                        <div className="discussion-meta">3h ago</div>
                      </div>
                    </div>
                    <div className="discussion-text">
                      "Drip irrigation has improved my yield by 30% this
                      season!"
                    </div>
                    <div className="discussion-stats">
                      <span>
                        <RiHeartLine className="me-1" /> 8
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Bottom Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Row className="g-3">
            <Col md={6} lg={4}>
              <Card className="feature-card soil-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">🌱</div>
                  <h6 className="fw-semibold mt-2 mb-2">
                    Soil Health Analysis
                  </h6>
                  <p className="mb-3" style={{ fontSize: "0.85rem" }}>
                    Check soil nutrients and get fertilizer recommendations
                  </p>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => navigate("/soil-health")}
                  >
                    Analyze Soil <RiArrowRightSLine />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="feature-card disease-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">🦠</div>
                  <h6 className="fw-semibold mt-2 mb-2">Disease Detection</h6>
                  <p className="mb-3" style={{ fontSize: "0.85rem" }}>
                    Upload crop image and get AI based disease diagnosis
                  </p>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => navigate("/disease-detection")}
                  >
                    Detect Now <RiArrowRightSLine />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="feature-card yield-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">📈</div>
                  <h6 className="fw-semibold mt-2 mb-2">Yield Prediction</h6>
                  <p className="mb-3" style={{ fontSize: "0.85rem" }}>
                    Predict your crop yield and expected income
                  </p>
                  <Button
                    size="sm"
                    variant="outline-info"
                    onClick={() => navigate("/yield-prediction")}
                  >
                    Predict <RiArrowRightSLine />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="feature-card market-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">🏪</div>
                  <h6 className="fw-semibold mt-2 mb-2">Market Prices</h6>
                  <p className="mb-3" style={{ fontSize: "0.85rem" }}>
                    Check real-time market prices for different crops in markets
                  </p>
                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={() => navigate("/yield-prediction")}
                  >
                    View Prices <RiArrowRightSLine />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="feature-card gov-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">🏛️</div>
                  <h6 className="fw-semibold mt-2 mb-2">Government Schemes</h6>
                  <p className="mb-3" style={{ fontSize: "0.85rem" }}>
                    Find and apply for government subsidies
                  </p>
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => navigate("/government-schemes")}
                  >
                    View Schemes <RiArrowRightSLine />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
