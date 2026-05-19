/**
 * Language Selection Page
 * First page shown to users for language selection
 */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";

const LanguageSelection = () => {
  const navigate = useNavigate();

  // Check if language was already selected
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    const isLanguageSkipped = localStorage.getItem("skipLanguageSelection");

    // If user already selected a language or skipped selection, go to login
    if (savedLanguage || isLanguageSkipped) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLanguageSelect = (language) => {
    // Language is already saved by LanguageSelector component
    // Redirect to login after selection
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleSkip = () => {
    // Mark that user skipped language selection
    localStorage.setItem("skipLanguageSelection", "true");
    navigate("/login");
  };

  return (
    <LanguageSelector
      onLanguageSelect={handleLanguageSelect}
      onSkip={handleSkip}
    />
  );
};

export default LanguageSelection;
