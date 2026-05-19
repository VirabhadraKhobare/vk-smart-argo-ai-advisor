/**
 * App.js
 * Main application component with providers and routing
 */
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

// i18n configuration
import i18n from "./i18n";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Routes
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
}

export default App;
