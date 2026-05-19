/**
 * Weather Page
 * Weather forecast and irrigation suggestions
 */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { Row, Col, Card, Badge, Form, Alert } from "react-bootstrap";
import {
  RiCloudLine,
  RiSunLine,
  RiRainyLine,
  RiWindyLine,
  RiWaterFlashLine,
  RiDropLine,
  RiThermometerLine,
  RiUmbrellaLine,
  RiCalendarLine,
  RiMapPinLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import weatherService from "../services/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [irrigation, setIrrigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Pune");

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const [weatherRes, irrigationRes] = await Promise.all([
        weatherService.getCurrent(city),
        weatherService.getIrrigationSuggestion(city),
      ]);

      setWeather(weatherRes.data);
      setIrrigation(irrigationRes.data);
    } catch (error) {
      toast.error("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: <RiSunLine size={48} />,
      Clouds: <RiCloudLine size={48} />,
      Rain: <RiRainyLine size={48} />,
      Drizzle: <RiRainyLine size={48} />,
      Thunderstorm: <RiRainyLine size={48} />,
      Snow: <RiUmbrellaLine size={48} />,
      Mist: <RiCloudLine size={48} />,
    };
    return icons[condition] || <RiSunLine size={48} />;
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const current = weather?.current || {};
  const forecast = weather?.forecast || [];

  return (
    <DashboardLayout title="Weather">
      <div className="animate-fade-in">
        {/* City Selector */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Weather Forecast</h4>
            <p className="text-muted mb-0">
              Real-time weather and irrigation planning
            </p>
          </div>
          <Form.Select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: 200, borderRadius: "12px" }}
          >
            <option value="Pune">Pune, MH</option>
            <option value="Mumbai">Mumbai, MH</option>
            <option value="Delhi">Delhi, NCR</option>
            <option value="Bangalore">Bangalore, KA</option>
            <option value="Chennai">Chennai, TN</option>
            <option value="Hyderabad">Hyderabad, TS</option>
            <option value="Ahmedabad">Ahmedabad, GJ</option>
            <option value="Kolkata">Kolkata, WB</option>
          </Form.Select>
        </div>

        <Row className="g-4">
          {/* Current Weather */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className="h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h5 className="mb-1">Current Weather</h5>
                      <p className="mb-0 opacity-75">
                        <RiMapPinLine className="me-1" />
                        {weather?.location?.city || city},{" "}
                        {weather?.location?.country || "India"}
                      </p>
                    </div>
                    <Badge bg="light" text="dark" className="rounded-pill">
                      Live
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div style={{ fontSize: "4rem" }}>
                      {getWeatherIcon(current.condition)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "3.5rem",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {Math.round(current.temperature || 28)}°C
                      </div>
                      <div
                        className="opacity-75"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {current.description || "Partly Cloudy"}
                      </div>
                      <div
                        className="opacity-75"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Feels like {Math.round(current.feelsLike || 30)}°C
                      </div>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md={3}>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <RiDropLine size={24} className="mb-2" />
                        <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                          Humidity
                        </div>
                        <div className="fw-bold">{current.humidity || 68}%</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <RiWindyLine size={24} className="mb-2" />
                        <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                          Wind Speed
                        </div>
                        <div className="fw-bold">
                          {current.windSpeed || 14} km/h
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <RiThermometerLine size={24} className="mb-2" />
                        <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                          Pressure
                        </div>
                        <div className="fw-bold">
                          {current.pressure || 1012} hPa
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <RiWaterFlashLine size={24} className="mb-2" />
                        <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                          Visibility
                        </div>
                        <div className="fw-bold">
                          {(current.visibility || 10000) / 1000} km
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Irrigation Suggestion */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-100" style={{ border: "none" }}>
                <Card.Body>
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <RiWaterFlashLine style={{ color: "#2196f3" }} />
                    Smart Irrigation
                  </h5>

                  {irrigation ? (
                    <div>
                      <div className="text-center mb-4">
                        <div
                          className="d-inline-flex align-items-center justify-content-center mb-3"
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: irrigation.shouldIrrigate
                              ? "linear-gradient(135deg, #e3f2fd, #bbdefb)"
                              : "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                            color: irrigation.shouldIrrigate
                              ? "#1976d2"
                              : "#e65100",
                          }}
                        >
                          <RiWaterFlashLine size={40} />
                        </div>
                        <h4
                          className="fw-bold"
                          style={{
                            color: irrigation.shouldIrrigate
                              ? "#1976d2"
                              : "#e65100",
                          }}
                        >
                          {irrigation.shouldIrrigate
                            ? "Irrigate Recommended"
                            : "Skip Irrigation"}
                        </h4>
                        <Badge
                          bg={
                            irrigation.urgency === "high"
                              ? "danger"
                              : irrigation.urgency === "medium"
                                ? "warning"
                                : "success"
                          }
                          className="rounded-pill"
                        >
                          {irrigation.urgency.toUpperCase()} URGENCY
                        </Badge>
                      </div>

                      <Alert
                        variant="info"
                        className="mb-3"
                        style={{ borderRadius: "12px" }}
                      >
                        <strong>Reason:</strong> {irrigation.reason}
                      </Alert>

                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Best Time:</h6>
                        <p className="text-muted mb-0">{irrigation.bestTime}</p>
                      </div>

                      {irrigation.tips?.length > 0 && (
                        <div>
                          <h6 className="fw-bold mb-2">Tips:</h6>
                          <ul className="list-unstyled mb-0">
                            {irrigation.tips.map((tip, idx) => (
                              <li
                                key={idx}
                                className="d-flex align-items-center gap-2 mb-1"
                              >
                                <RiSunLine
                                  size={14}
                                  style={{ color: "#ff9800" }}
                                />
                                <span style={{ fontSize: "0.9rem" }}>
                                  {tip}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <RiWaterFlashLine
                        size={48}
                        style={{ opacity: 0.3 }}
                        className="mb-2"
                      />
                      <p>No irrigation data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* 7-Day Forecast */}
        <Card className="mt-4">
          <Card.Body>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <RiCalendarLine style={{ color: "#4a7c2a" }} />
              7-Day Forecast
            </h5>
            <Row className="g-3">
              {forecast.map((day, idx) => (
                <Col key={idx} md={6} lg={3} xl={2}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className="text-center h-100"
                      style={{ border: "1px solid #e9ecef" }}
                    >
                      <Card.Body>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {new Date(day.date).toLocaleDateString("en", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <div className="mb-2" style={{ color: "#4a7c2a" }}>
                          {getWeatherIcon(day.condition)}
                        </div>
                        <h6 className="fw-bold mb-1">{day.condition}</h6>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {day.description}
                        </p>
                        <div className="d-flex justify-content-center gap-2">
                          <span className="fw-bold">
                            {Math.round(day.temperature?.max || 30)}°
                          </span>
                          <span className="text-muted">
                            {Math.round(day.temperature?.min || 22)}°
                          </span>
                        </div>
                        {day.rainProbability > 0 && (
                          <Badge
                            bg="info"
                            className="mt-2 rounded-pill"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <RiUmbrellaLine className="me-1" />
                            {day.rainProbability}%
                          </Badge>
                        )}
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Weather;
