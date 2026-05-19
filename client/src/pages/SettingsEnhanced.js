/**
 * Settings Page - Enhanced
 * Complete profile management, security, preferences, and notifications
 */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Tabs,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import {
  RiUserLine,
  RiLockLine,
  RiMoonLine,
  RiSunLine,
  RiNotification3Line,
  RiSaveLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
  RiBellLine,
  RiMapPinLine,
  RiPhoneLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import authService from "../services/authService";

const SettingsEnhanced = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    state: user?.location?.state || "",
    district: user?.location?.district || "",
    farmSize: user?.farmSize || "",
    farmType: user?.farmType || "mixed",
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications !== false,
    emailAlerts: user?.preferences?.emailAlerts !== false,
    diseaseAlerts: user?.preferences?.diseaseAlerts !== false,
    weatherAlerts: user?.preferences?.weatherAlerts !== false,
    marketAlerts: user?.preferences?.marketAlerts !== false,
    language: user?.preferences?.language || "en",
    dataCollection: user?.preferences?.dataCollection !== false,
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [profileDirty, setProfileDirty] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  useEffect(() => {
    const pwd = passwords.newPassword;
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd) && /[^a-zA-Z\d]/.test(pwd)) strength += 25;
    setPasswordStrength(strength);
  }, [passwords.newPassword]);

  // Handle profile change
  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setProfileDirty(true);
  };

  // Submit profile changes
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      await authService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        location: { state: profile.state, district: profile.district },
        farmSize: parseFloat(profile.farmSize) || 0,
        farmType: profile.farmType,
      });
      updateUser({ name: profile.name });
      setProfileDirty(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Save preferences
  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await authService.updateProfile({
        preferences,
      });
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "danger";
    if (passwordStrength < 50) return "warning";
    if (passwordStrength < 75) return "info";
    return "success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  return (
    <DashboardLayout title="Settings">
      <div className="animate-fade-in">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Settings & Preferences</h4>
          <p className="text-muted mb-0">
            Manage your account, security, and notification preferences
          </p>
        </div>

        <Row className="g-4">
          {/* User Profile Card */}
          <Col lg={3}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky-top" style={{ top: "80px" }}>
                <Card.Body className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                      color: "white",
                      fontSize: "2.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <h5 className="fw-bold mb-1">{user?.name || "User"}</h5>
                  <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                    {user?.email}
                  </p>
                  <Badge bg="success" className="rounded-pill mb-3">
                    {user?.role === "admin" ? "Administrator" : "Farmer"}
                  </Badge>
                  <hr />
                  <div className="text-start">
                    <p className="mb-2" style={{ fontSize: "0.85rem" }}>
                      <RiPhoneLine
                        className="me-2"
                        style={{ color: "#2d5016" }}
                      />
                      <strong>{user?.phone || "Not provided"}</strong>
                    </p>
                    <p className="mb-2" style={{ fontSize: "0.85rem" }}>
                      <RiMapPinLine
                        className="me-2"
                        style={{ color: "#2d5016" }}
                      />
                      <strong>
                        {user?.location?.district || "Not set"},{" "}
                        {user?.location?.state || ""}
                      </strong>
                    </p>
                    <p style={{ fontSize: "0.85rem" }}>
                      <RiShieldCheckLine
                        className="me-2"
                        style={{ color: "#2d5016" }}
                      />
                      <strong>Account verified</strong>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Settings Tabs */}
          <Col lg={9}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <Card.Body>
                  <Tabs
                    defaultActiveKey="profile"
                    className="mb-4"
                    variant="pills"
                  >
                    {/* Profile Tab */}
                    <Tab
                      eventKey="profile"
                      title={
                        <span>
                          <RiUserLine className="me-2" />
                          Profile
                        </span>
                      }
                    >
                      <Form onSubmit={handleProfileUpdate} className="pt-3">
                        {profileDirty && (
                          <Alert variant="info" className="mb-3">
                            <RiCheckLine className="me-2" />
                            You have unsaved changes. Click Save to update your
                            profile.
                          </Alert>
                        )}

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Full Name *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={profile.name}
                                onChange={(e) =>
                                  handleProfileChange("name", e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Email Address
                              </Form.Label>
                              <Form.Control
                                type="email"
                                value={profile.email}
                                disabled
                                placeholder="Email cannot be changed"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Phone Number
                              </Form.Label>
                              <Form.Control
                                type="tel"
                                value={profile.phone}
                                onChange={(e) =>
                                  handleProfileChange("phone", e.target.value)
                                }
                                placeholder="10-digit phone number"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Farm Type
                              </Form.Label>
                              <Form.Select
                                value={profile.farmType}
                                onChange={(e) =>
                                  handleProfileChange(
                                    "farmType",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="mixed">Mixed Farming</option>
                                <option value="crop">Crop Farming</option>
                                <option value="dairy">Dairy Farming</option>
                                <option value="organic">Organic Farming</option>
                                <option value="horticulture">
                                  Horticulture
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">State</Form.Label>
                              <Form.Control
                                type="text"
                                value={profile.state}
                                onChange={(e) =>
                                  handleProfileChange("state", e.target.value)
                                }
                                placeholder="State name"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                District
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={profile.district}
                                onChange={(e) =>
                                  handleProfileChange(
                                    "district",
                                    e.target.value,
                                  )
                                }
                                placeholder="District name"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Farm Size (Acres)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={profile.farmSize}
                            onChange={(e) =>
                              handleProfileChange("farmSize", e.target.value)
                            }
                            placeholder="0.0"
                            min="0"
                            step="0.1"
                          />
                        </Form.Group>

                        <div className="d-flex gap-2">
                          <Button
                            type="submit"
                            disabled={loading || !profileDirty}
                            style={{
                              background:
                                "linear-gradient(135deg, #2d5016, #4a7c2a)",
                              border: "none",
                            }}
                          >
                            <RiSaveLine className="me-2" /> Save Changes
                          </Button>
                          {profileDirty && (
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                setProfile({
                                  name: user?.name || "",
                                  email: user?.email || "",
                                  phone: user?.phone || "",
                                  state: user?.location?.state || "",
                                  district: user?.location?.district || "",
                                  farmSize: user?.farmSize || "",
                                  farmType: user?.farmType || "mixed",
                                });
                                setProfileDirty(false);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </Form>
                    </Tab>

                    {/* Security Tab */}
                    <Tab
                      eventKey="security"
                      title={
                        <span>
                          <RiLockLine className="me-2" />
                          Security
                        </span>
                      }
                    >
                      <Form onSubmit={handlePasswordChange} className="pt-3">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Current Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={passwords.currentPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="Enter your current password"
                            required
                          />
                          <Form.Text className="text-muted">
                            Required for security verification
                          </Form.Text>
                        </Form.Group>

                        <hr />

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            New Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                            required
                            minLength={6}
                          />
                          <Form.Text className="text-muted">
                            Minimum 6 characters recommended
                          </Form.Text>
                        </Form.Group>

                        {passwords.newPassword && (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="fw-bold">
                                Password Strength
                              </small>
                              <small
                                style={{
                                  color: `var(--bs-${getPasswordStrengthColor()})`,
                                }}
                              >
                                {getPasswordStrengthText()}
                              </small>
                            </div>
                            <ProgressBar
                              now={passwordStrength}
                              variant={getPasswordStrengthColor()}
                              style={{ height: "8px" }}
                            />
                          </div>
                        )}

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Confirm New Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm your new password"
                            required
                          />
                          {passwords.newPassword &&
                            passwords.confirmPassword &&
                            passwords.newPassword ===
                              passwords.confirmPassword && (
                              <Form.Text className="text-success">
                                <RiCheckLine className="me-1" />
                                Passwords match
                              </Form.Text>
                            )}
                          {passwords.newPassword &&
                            passwords.confirmPassword &&
                            passwords.newPassword !==
                              passwords.confirmPassword && (
                              <Form.Text className="text-danger">
                                <RiErrorWarningLine className="me-1" />
                                Passwords do not match
                              </Form.Text>
                            )}
                        </Form.Group>

                        <Button
                          type="submit"
                          disabled={
                            loading ||
                            !passwords.currentPassword ||
                            !passwords.newPassword
                          }
                          style={{
                            background:
                              "linear-gradient(135deg, #2d5016, #4a7c2a)",
                            border: "none",
                          }}
                        >
                          <RiLockLine className="me-2" /> Change Password
                        </Button>
                      </Form>
                    </Tab>

                    {/* Notifications Tab */}
                    <Tab
                      eventKey="notifications"
                      title={
                        <span>
                          <RiBellLine className="me-2" />
                          Notifications
                        </span>
                      }
                    >
                      <Form className="pt-3">
                        <h6 className="fw-bold mb-3">Alert Types</h6>

                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <Form.Check
                            type="switch"
                            id="diseaseAlerts"
                            label={
                              <span>
                                <strong>Disease Alerts</strong>
                                <br />
                                <small className="text-muted">
                                  Get notified when diseases are detected on
                                  your crops
                                </small>
                              </span>
                            }
                            checked={preferences.diseaseAlerts}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                diseaseAlerts: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <Form.Check
                            type="switch"
                            id="weatherAlerts"
                            label={
                              <span>
                                <strong>Weather Alerts</strong>
                                <br />
                                <small className="text-muted">
                                  Receive weather warnings and forecasts for
                                  your region
                                </small>
                              </span>
                            }
                            checked={preferences.weatherAlerts}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                weatherAlerts: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <Form.Check
                            type="switch"
                            id="marketAlerts"
                            label={
                              <span>
                                <strong>Market Alerts</strong>
                                <br />
                                <small className="text-muted">
                                  Know about market price changes and trends
                                </small>
                              </span>
                            }
                            checked={preferences.marketAlerts}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                marketAlerts: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <hr />
                        <h6 className="fw-bold mb-3">Notification Methods</h6>

                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <Form.Check
                            type="switch"
                            id="pushNotifications"
                            label={
                              <span>
                                <strong>Push Notifications</strong>
                                <br />
                                <small className="text-muted">
                                  Receive notifications in the app
                                </small>
                              </span>
                            }
                            checked={preferences.notifications}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                notifications: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <Form.Check
                            type="switch"
                            id="emailAlerts"
                            label={
                              <span>
                                <strong>Email Notifications</strong>
                                <br />
                                <small className="text-muted">
                                  Receive important alerts via email
                                </small>
                              </span>
                            }
                            checked={preferences.emailAlerts}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                emailAlerts: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <Button
                          disabled={loading}
                          onClick={handleSavePreferences}
                          style={{
                            background:
                              "linear-gradient(135deg, #2d5016, #4a7c2a)",
                            border: "none",
                          }}
                        >
                          <RiSaveLine className="me-2" /> Save Preferences
                        </Button>
                      </Form>
                    </Tab>

                    {/* Preferences Tab */}
                    <Tab
                      eventKey="preferences"
                      title={
                        <span>
                          <RiNotification3Line className="me-2" />
                          Preferences
                        </span>
                      }
                    >
                      <Form className="pt-3">
                        <h6 className="fw-bold mb-3">Appearance</h6>
                        <div
                          className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4"
                          style={{ background: "#f8f9fa" }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            {theme === "dark" ? (
                              <RiMoonLine
                                size={24}
                                style={{ color: "#2d5016" }}
                              />
                            ) : (
                              <RiSunLine
                                size={24}
                                style={{ color: "#2d5016" }}
                              />
                            )}
                            <div>
                              <div className="fw-medium">Theme</div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {theme === "dark"
                                  ? "Dark mode is active"
                                  : "Light mode is active"}
                              </div>
                            </div>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={theme === "dark"}
                            onChange={toggleTheme}
                          />
                        </div>

                        <h6 className="fw-bold mb-3">Language</h6>
                        <Form.Select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className="mb-4"
                        >
                          <option value="en">English</option>
                          <option value="hi">हिंदी (Hindi)</option>
                          <option value="mr">मराठी (Marathi)</option>
                          <option value="gu">ગુજરાતી (Gujarati)</option>
                          <option value="ta">தமிழ் (Tamil)</option>
                          <option value="te">తెలుగు (Telugu)</option>
                        </Form.Select>

                        <h6 className="fw-bold mb-3">Data & Privacy</h6>
                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <Form.Check
                            type="switch"
                            id="dataCollection"
                            label={
                              <span>
                                <strong>Allow Anonymous Data Collection</strong>
                                <br />
                                <small className="text-muted">
                                  Help us improve by sharing anonymized usage
                                  data
                                </small>
                              </span>
                            }
                            checked={preferences.dataCollection}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                dataCollection: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <Button
                          disabled={loading}
                          onClick={handleSavePreferences}
                          style={{
                            background:
                              "linear-gradient(135deg, #2d5016, #4a7c2a)",
                            border: "none",
                          }}
                        >
                          <RiSaveLine className="me-2" /> Save All Preferences
                        </Button>
                      </Form>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default SettingsEnhanced;
