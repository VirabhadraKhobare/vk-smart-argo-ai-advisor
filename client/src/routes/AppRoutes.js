/**
 * Routes Configuration
 * Centralized route definitions with lazy loading
 */
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

// Lazy load pages for better performance
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const LanguageSelection = lazy(() => import("../pages/LanguageSelection"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const CropAnalysis = lazy(() => import("../pages/CropAnalysis"));
const SoilHealth = lazy(() => import("../pages/SoilHealth"));
const YieldPrediction = lazy(() => import("../pages/YieldPrediction"));
const Weather = lazy(() => import("../pages/Weather"));
const DiseaseDetection = lazy(() => import("../pages/DiseaseDetection"));
const DiseaseAlertsHistory = lazy(
  () => import("../pages/DiseaseAlertsHistory"),
);
const AIAssistant = lazy(() => import("../pages/AIAssistant"));
const Notifications = lazy(() => import("../pages/Notifications"));
const GovernmentSchemes = lazy(() => import("../pages/GovernmentSchemes"));
const Community = lazy(() => import("../pages/Community"));
const Settings = lazy(() => import("../pages/SettingsEnhanced"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100vh" }}
  >
    <Spinner animation="border" variant="success" />
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Language Selection Route - shows for first time users */}
        <Route
          path="/language"
          element={<LanguageSelection />}
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crop-analysis"
          element={
            <ProtectedRoute>
              <CropAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/soil-health"
          element={
            <ProtectedRoute>
              <SoilHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yield-prediction"
          element={
            <ProtectedRoute>
              <YieldPrediction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disease-detection"
          element={
            <ProtectedRoute>
              <DiseaseDetection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disease-alerts-history"
          element={
            <ProtectedRoute>
              <DiseaseAlertsHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/government-schemes"
          element={
            <ProtectedRoute>
              <GovernmentSchemes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
