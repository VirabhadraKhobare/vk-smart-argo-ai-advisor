/**
 * Register Page
 * User registration with role selection
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import {
  RiSeedlingLine,
  RiUserLine,
  RiMailLine,
  RiLockLine,
  RiPhoneLine,
  RiMapPinLine,
} from "react-icons/ri";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "farmer",
    farmSize: "",
    state: "",
    district: "",
  });
  const [showPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...registerData } = formData;
      await register({
        ...registerData,
        location: {
          state: registerData.state,
          district: registerData.district,
        },
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: "linear-gradient(135deg, #f8faf5 0%, #e8f5e9 100%)",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-100"
        style={{
          maxWidth: 500,
        }}
      >
        <div
          className="card shadow-lg w-100"
          style={{ borderRadius: "20px", border: "none" }}
        >
          <div className="card-body p-4">
            {/* Logo */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                  color: "white",
                  fontSize: "1.75rem",
                }}
              >
                <RiSeedlingLine />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#2d5016" }}>
                Create Account
              </h2>
              <p className="text-muted">Join Smart Agro AI Advisor</p>
            </div>

            {error && (
              <Alert
                variant="danger"
                className="mb-3"
                style={{ borderRadius: "12px" }}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Full Name</Form.Label>
                    <div className="position-relative">
                      <RiUserLine
                        className="position-absolute"
                        style={{
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        style={{
                          borderRadius: "12px",
                          paddingLeft: "2.75rem",
                          height: "48px",
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Phone Number</Form.Label>
                    <div className="position-relative">
                      <RiPhoneLine
                        className="position-absolute"
                        style={{
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                        style={{
                          borderRadius: "12px",
                          paddingLeft: "2.75rem",
                          height: "48px",
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Email Address</Form.Label>
                <div className="position-relative">
                  <RiMailLine
                    className="position-absolute"
                    style={{
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                    }}
                  />
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    style={{
                      borderRadius: "12px",
                      paddingLeft: "2.75rem",
                      height: "48px",
                    }}
                  />
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Password</Form.Label>
                    <div className="position-relative">
                      <RiLockLine
                        className="position-absolute"
                        style={{
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        style={{
                          borderRadius: "12px",
                          paddingLeft: "2.75rem",
                          height: "48px",
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      Confirm Password
                    </Form.Label>
                    <div className="position-relative">
                      <RiLockLine
                        className="position-absolute"
                        style={{
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                        style={{
                          borderRadius: "12px",
                          paddingLeft: "2.75rem",
                          height: "48px",
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">State</Form.Label>
                    <div className="position-relative">
                      <RiMapPinLine
                        className="position-absolute"
                        style={{
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Your state"
                        style={{
                          borderRadius: "12px",
                          paddingLeft: "2.75rem",
                          height: "48px",
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">District</Form.Label>
                    <div className="position-relative">
                      <RiMapPinLine
                        className="position-absolute"
                        style={{
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Form.Control
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Your district"
                        style={{
                          borderRadius: "12px",
                          paddingLeft: "2.75rem",
                          height: "48px",
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Farm Size (Acres)</Form.Label>
                <Form.Control
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  placeholder="Optional"
                  min="0"
                  step="0.1"
                  style={{ borderRadius: "12px" }}
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                disabled={loading}
                style={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                  border: "none",
                  fontWeight: 600,
                  minHeight: "48px",
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </Form>

            <p className="text-center mt-4 mb-0">
              Already have an account?{" "}
              <Link
                to="/login"
                className="fw-semibold"
                style={{ color: "#2d5016" }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
