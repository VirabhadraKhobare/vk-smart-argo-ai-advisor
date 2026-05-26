/**
 * TopNavbar Component
 * Top navigation bar with search, notifications, and user actions
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMenuLine,
  RiSearchLine,
  RiNotification3Line,
  RiMoonLine,
  RiSunLine,
  RiLogoutBoxRLine,
  RiUserLine,
  RiSettingsLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { Dropdown } from "react-bootstrap";
import "./TopNavbar.css";

const TopNavbar = ({ title, collapsed }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search navigation
      console.log("Search:", searchQuery);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    const handleDocClick = (e) => {
      const clickedSidebar = e.target.closest && e.target.closest(".sidebar");
      const clickedToggle = e.target.closest && e.target.closest(".navbar-btn");
      if (!clickedSidebar && !clickedToggle) setSidebarOpen(false);
    };

    if (sidebarOpen) document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, [sidebarOpen]);

  return (
    <header className={`top-navbar ${collapsed ? "top-navbar-expanded" : ""}`}>
      {/* Mobile menu button + Title */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="navbar-btn d-lg-none me-2"
          aria-label="Toggle menu"
          onClick={toggleSidebar}
        >
          <RiMenuLine />
        </button>
        <h1 className="navbar-title mb-0">{title}</h1>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {/* Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSearch}
              className="d-flex"
            >
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </motion.form>
          )}
        </AnimatePresence>

        <button
          className="navbar-btn"
          onClick={() => setShowSearch(!showSearch)}
        >
          <RiSearchLine />
        </button>

        {/* Theme Toggle */}
        <button className="navbar-btn" onClick={toggleTheme}>
          {theme === "dark" ? <RiSunLine /> : <RiMoonLine />}
        </button>

        {/* Notifications (link to notifications page) */}
        <button
          className="navbar-btn position-relative"
          onClick={() => navigate("/notifications")}
        >
          <RiNotification3Line />
          {unreadCount > 0 && (
            <span className="navbar-badge">{unreadCount}</span>
          )}
        </button>

        {/* User Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            className="d-flex align-items-center gap-2 border-0 bg-transparent"
            style={{ padding: "0.5rem" }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span
              className="d-none d-md-block fw-medium"
              style={{ fontSize: "0.9rem" }}
            >
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <RiArrowDownSLine />
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="shadow-lg border-0 top-navbar-dropdown"
            style={{ borderRadius: "12px", padding: "0.5rem" }}
          >
            <Dropdown.Item
              onClick={() => navigate("/settings")}
              className="d-flex align-items-center gap-2 py-2 top-navbar-dropdown-item"
            >
              <RiUserLine /> Profile
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => navigate("/settings")}
              className="d-flex align-items-center gap-2 py-2 top-navbar-dropdown-item"
            >
              <RiSettingsLine /> Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={handleLogout}
              className="d-flex align-items-center gap-2 py-2 top-navbar-logout-item"
            >
              <RiLogoutBoxRLine /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default TopNavbar;
