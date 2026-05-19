/**
 * Sidebar Component
 * Responsive navigation sidebar with collapsible menu
 */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  RiDashboardLine,
  RiPlantLine,
  RiEarthLine,
  RiBarChartBoxLine,
  RiCloudLine,
  RiVirusLine,
  RiRobot2Line,
  RiGovernmentLine,
  RiTeamLine,
  RiSettings3Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiSeedlingLine,
  RiAlertLine,
  RiBellLine,
} from "react-icons/ri";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: RiDashboardLine,
    section: "OVERVIEW",
  },
  {
    path: "/crop-analysis",
    label: "Crop Analysis",
    icon: RiPlantLine,
    section: "AI ANALYSIS",
  },
  {
    path: "/soil-health",
    label: "Soil Health",
    icon: RiEarthLine,
    section: "AI ANALYSIS",
  },
  {
    path: "/yield-prediction",
    label: "Yield Prediction",
    icon: RiBarChartBoxLine,
    section: "AI ANALYSIS",
  },
  {
    path: "/weather",
    label: "Weather",
    icon: RiCloudLine,
    section: "INSIGHTS",
  },
  {
    path: "/disease-detection",
    label: "Detect Disease",
    icon: RiVirusLine,
    section: "INSIGHTS",
  },
  {
    path: "/disease-alerts-history",
    label: "Alert History",
    icon: RiAlertLine,
    section: "INSIGHTS",
  },
  {
    path: "/ai-assistant",
    label: "AI Assistant",
    icon: RiRobot2Line,
    section: "COMMUNITY",
  },
  {
    path: "/notifications",
    label: "Notifications",
    icon: RiBellLine,
    section: "COMMUNITY",
  },
  {
    path: "/government-schemes",
    label: "Gov. Schemes",
    icon: RiGovernmentLine,
    section: "COMMUNITY",
  },
  {
    path: "/community",
    label: "Community",
    icon: RiTeamLine,
    section: "COMMUNITY",
  },
  { path: "/settings", label: "Settings", icon: RiSettings3Line, section: "" },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Sync body class with mobileOpen so TopNavbar and Sidebar both work
  useEffect(() => {
    if (mobileOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
    return () => document.body.classList.remove("sidebar-open");
  }, [mobileOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Toggle Button */}
      <button
        className="d-lg-none position-fixed btn btn-light shadow-sm"
        style={{ top: "1rem", left: "1rem", zIndex: 1001, borderRadius: "8px" }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <RiMenuFoldLine /> : <RiMenuUnfoldLine />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <RiSeedlingLine />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="sidebar-brand-text">Smart Agro</div>
              <div className="sidebar-brand-subtitle">AI Advisor</div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section}>
              {section && !collapsed && (
                <div className="sidebar-section-title">{section}</div>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    title={collapsed ? item.label : ""}
                  >
                    <span className="sidebar-link-icon">
                      <Icon />
                    </span>
                    {!collapsed && (
                      <span className="sidebar-link-text">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer / User */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{getInitials(user?.name)}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.name || "User"}</div>
                <div className="sidebar-user-role">
                  {user?.role === "admin" ? "Administrator" : "Farmer"}
                  {user?.location?.district && ` · ${user.location.district}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
