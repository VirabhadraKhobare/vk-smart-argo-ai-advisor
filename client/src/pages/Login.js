/**
 * Login Page
 * User authentication with form validation
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Form, Button, Alert, Spinner, Dropdown } from "react-bootstrap";
import {
  RiSeedlingLine,
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      toast.success("Welcome back! Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #f8faf5 0%, #e8f5e9 100%)",
        padding: "1rem",
      }}
    >
      {/* Language Switcher */}
      <Dropdown className="position-absolute top-0 end-0 m-3">
        <Dropdown.Toggle
          variant="outline-secondary"
          size="sm"
          id="language-dropdown"
          style={{
            minWidth: 44,
            padding: "0.35rem 0.45rem",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Select language"
        >
          <span style={{ fontSize: "1.05rem" }}>
            {languages.find((l) => l.code === i18n.language)?.flag || "🌐"}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          {languages.map((lang) => (
            <Dropdown.Item
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              active={i18n.language === lang.code}
            >
              {lang.flag} {lang.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-100"
        style={{
          width: "100%",
          maxWidth: 420,
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
                Welcome Back
              </h2>
              <p className="text-muted">Sign in to your Smart Agro account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                variant="danger"
                className="mb-3"
                style={{ borderRadius: "12px" }}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Email Address</Form.Label>
                <div className="position-relative">
                  <RiMailLine
                    className="position-absolute"
                    style={{
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      pointerEvents: "none",
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
                      fontSize: "1rem",
                      height: "48px",
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Password</Form.Label>
                <div className="position-relative">
                  <RiLockLine
                    className="position-absolute"
                    style={{
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      pointerEvents: "none",
                    }}
                  />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    style={{
                      borderRadius: "12px",
                      paddingLeft: "2.75rem",
                      paddingRight: "3rem",
                      fontSize: "1rem",
                      height: "48px",
                    }}
                  />
                  <button
                    type="button"
                    className="position-absolute bg-transparent border-0"
                    style={{
                      right: "0.5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      cursor: "pointer",
                      padding: "0.5rem",
                      minWidth: "44px",
                      minHeight: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 fw-semibold"
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>

            {/* Divider */}
            <div className="d-flex align-items-center my-4">
              <div
                className="flex-grow-1 border-top"
                style={{ borderColor: "#e9ecef" }}
              ></div>
              <span className="mx-3 text-muted" style={{ fontSize: "0.85rem" }}>
                or
              </span>
              <div
                className="flex-grow-1 border-top"
                style={{ borderColor: "#e9ecef" }}
              ></div>
            </div>

            {/* Register Link */}
            <p className="text-center mb-0">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="fw-semibold"
                style={{ color: "#2d5016" }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-4 text-muted"
          style={{ fontSize: "0.85rem" }}
        >
          Smart Agro AI Advisor · AI-Powered Precision Farming
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
