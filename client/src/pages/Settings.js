/**
 * Settings Page
 * Profile management, password change, preferences
 */
import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Tabs,
  Badge,
} from "react-bootstrap";
import {
  RiUserLine,
  RiLockLine,
  RiMoonLine,
  RiSunLine,
  RiNotification3Line,
  RiSaveLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import authService from "../services/authService";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    state: user?.location?.state || "",
    district: user?.location?.district || "",
    farmSize: user?.farmSize || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications !== false,
    language: user?.preferences?.language || "en",
  });

  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        location: { state: profile.state, district: profile.district },
        farmSize: profile.farmSize,
      });
      updateUser({ name: profile.name });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
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

  return (
    <DashboardLayout title="Settings">
      <div className="animate-fade-in">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Settings</h4>
          <p className="text-muted mb-0">
            Manage your profile, security, and preferences
          </p>
        </div>

        <Row className="g-4">
          <Col lg={3}>
            <Card>
              <Card.Body className="text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h5 className="fw-bold mb-1">{user?.name || "User"}</h5>
                <p className="text-muted mb-2">{user?.email}</p>
                <Badge bg="success" className="rounded-pill">
                  {user?.role === "admin" ? "Administrator" : "Farmer"}
                </Badge>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card>
              <Card.Body>
                <Tabs defaultActiveKey="profile" className="mb-4">
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
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={profile.name}
                              onChange={(e) =>
                                setProfile({ ...profile, name: e.target.value })
                              }
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              value={profile.phone}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="10-digit number"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              value={profile.state}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  state: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>District</Form.Label>
                            <Form.Control
                              type="text"
                              value={profile.district}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  district: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Farm Size (Acres)</Form.Label>
                        <Form.Control
                          type="number"
                          value={profile.farmSize}
                          onChange={(e) =>
                            setProfile({ ...profile, farmSize: e.target.value })
                          }
                          min="0"
                          step="0.1"
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        disabled={loading}
                        style={{
                          background:
                            "linear-gradient(135deg, #2d5016, #4a7c2a)",
                          border: "none",
                        }}
                      >
                        <RiSaveLine className="me-2" /> Save Changes
                      </Button>
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
                    <Form onSubmit={handlePasswordChange}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwords.currentPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwords.newPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        disabled={loading}
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
                    <Form>
                      <h6 className="fw-bold mb-3">Appearance</h6>
                      <div
                        className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3"
                        style={{ background: "#f8f9fa" }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          {theme === "dark" ? (
                            <RiMoonLine size={24} />
                          ) : (
                            <RiSunLine size={24} />
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

                      <h6 className="fw-bold mb-3">Notifications</h6>
                      <div
                        className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3"
                        style={{ background: "#f8f9fa" }}
                      >
                        <div>
                          <div className="fw-medium">Push Notifications</div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Receive alerts about crops, weather, and diseases
                          </div>
                        </div>
                        <Form.Check
                          type="switch"
                          checked={preferences.notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              notifications: e.target.checked,
                            })
                          }
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
                        className="mb-3"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                        <option value="gu">Gujarati</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                      </Form.Select>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
