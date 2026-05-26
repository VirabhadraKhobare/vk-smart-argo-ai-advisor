import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import api from "../services/api";
import "./LanguageSwitcher.css";

const LanguageSwitcher = ({ compact = false, showLabel = true }) => {
  const { i18n, t } = useTranslation(["common"]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
    { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
    { code: "kok", name: "Konkani", nativeName: "कोंकणी", flag: "🇮🇳" },
    { code: "sa", name: "Sanskrit", nativeName: "संस्कृत", flag: "🇮🇳" },
    { code: "mni", name: "Manipuri", nativeName: "ମଣିପୁରୀ", flag: "🇮🇳" },
    { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
    { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", flag: "🇮🇳" },
    { code: "hry", name: "Haryanvi", nativeName: "हरियाणवी", flag: "🇮🇳" },
    { code: "raj", name: "Rajasthani", nativeName: "राजस्थानी", flag: "🇮🇳" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  // Handle language change
  const handleLanguageChange = async (languageCode) => {
    setIsLoading(true);
    try {
      // Change language in i18n
      await i18n.changeLanguage(languageCode);

      // Save to localStorage
      localStorage.setItem("preferredLanguage", languageCode);

      // Update backend if user is logged in
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await api.put("/auth/update-language", { language: languageCode });
        } catch (error) {
          console.warn(
            "Could not update language preference on server:",
            error,
          );
          // Silently fail - language is still changed locally
        }
      }

      // Close dropdown
      setIsOpen(false);

      // Show success message
      const successMsg =
        languageCode === "en"
          ? "Language changed successfully"
          : "भाषा सफलतापूर्वक बदल दी गई";
      console.log(successMsg);
    } catch (error) {
      console.error("Error changing language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="language-switcher-compact">
        <button
          className="language-button-compact"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          title={t("language", "Language")}
        >
          <span className="language-flag-compact">
            {currentLanguage?.flag || "🌐"}
          </span>
          <span className="language-code-compact">
            {currentLanguage?.code.toUpperCase()}
          </span>
        </button>

        {isOpen && (
          <motion.div
            className="language-dropdown-compact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="language-list-compact">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-option-compact ${lang.code === i18n.language ? "active" : ""}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isLoading}
                >
                  <span className="flag">{lang.flag}</span>
                  <span className="name">{lang.name}</span>
                  {lang.code === i18n.language && (
                    <span className="checkmark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="language-switcher">
      {showLabel && (
        <label className="language-label">{t("language", "Language")}</label>
      )}

      <div className="language-selector-wrapper">
        <button
          className="language-button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
        >
          <span className="language-flag">{currentLanguage?.flag || "🌐"}</span>
          <span className="language-name-display">
            {currentLanguage?.name || "Select Language"}
          </span>
          <span className="language-native-display">
            {currentLanguage?.nativeName}
          </span>
          <span className={`dropdown-icon ${isOpen ? "open" : ""}`}>▼</span>
        </button>

        {isOpen && (
          <motion.div
            className="language-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dropdown-header">
              <h4>{t("selectLanguage", "Select Your Language")}</h4>
            </div>
            <div className="language-grid">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  className={`language-option ${lang.code === i18n.language ? "active" : ""}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="option-flag">{lang.flag}</span>
                  <span className="option-name">{lang.name}</span>
                  <span className="option-native">{lang.nativeName}</span>
                  {lang.code === i18n.language && (
                    <span className="option-checkmark">✓</span>
                  )}
                </motion.button>
              ))}
            </div>
            {isLoading && (
              <div className="dropdown-loading">
                <span>Changing language...</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
