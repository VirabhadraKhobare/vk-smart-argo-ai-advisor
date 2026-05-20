import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./LanguageSelector.css";

const LanguageSelector = ({ onLanguageSelect, onSkip }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const showRecommended = true;

  // All available languages with metadata
  const languages = useMemo(
    () => [
      {
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇬🇧",
        region: "All India",
      },
      {
        code: "hi",
        name: "Hindi",
        nativeName: "हिन्दी",
        flag: "🇮🇳",
        region: "North India",
      },
      {
        code: "mr",
        name: "Marathi",
        nativeName: "मराठी",
        flag: "🇮🇳",
        region: "Maharashtra",
      },
      {
        code: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        flag: "🇮🇳",
        region: "Karnataka",
      },
      {
        code: "ta",
        name: "Tamil",
        nativeName: "தமிழ்",
        flag: "🇮🇳",
        region: "Tamil Nadu",
      },
      {
        code: "te",
        name: "Telugu",
        nativeName: "తెలుగు",
        flag: "🇮🇳",
        region: "Andhra Pradesh",
      },
      {
        code: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം",
        flag: "🇮🇳",
        region: "Kerala",
      },
      {
        code: "gu",
        name: "Gujarati",
        nativeName: "ગુજરાતી",
        flag: "🇮🇳",
        region: "Gujarat",
      },
      {
        code: "pa",
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ",
        flag: "🇮🇳",
        region: "Punjab",
      },
      {
        code: "bn",
        name: "Bengali",
        nativeName: "বাংলা",
        flag: "🇮🇳",
        region: "West Bengal",
      },
      {
        code: "or",
        name: "Odia",
        nativeName: "ଓଡ଼ିଆ",
        flag: "🇮🇳",
        region: "Odisha",
      },
      {
        code: "ur",
        name: "Urdu",
        nativeName: "اردو",
        flag: "🇮🇳",
        region: "Urdu Speaking",
      },
      {
        code: "as",
        name: "Assamese",
        nativeName: "অসমীয়া",
        flag: "🇮🇳",
        region: "Assam",
      },
      {
        code: "kok",
        name: "Konkani",
        nativeName: "कोंकणी",
        flag: "🇮🇳",
        region: "Goa",
      },
      {
        code: "sa",
        name: "Sanskrit",
        nativeName: "संस्कृत",
        flag: "🇮🇳",
        region: "Classical",
      },
      {
        code: "mni",
        name: "Manipuri",
        nativeName: "ମଣିପୁରୀ",
        flag: "🇮🇳",
        region: "Manipur",
      },
      {
        code: "ne",
        name: "Nepali",
        nativeName: "नेपाली",
        flag: "🇳🇵",
        region: "Himalayan Region",
      },
      {
        code: "bho",
        name: "Bhojpuri",
        nativeName: "भोजपुरी",
        flag: "🇮🇳",
        region: "Eastern Region",
      },
      {
        code: "hry",
        name: "Haryanvi",
        nativeName: "हरियाणवी",
        flag: "🇮🇳",
        region: "Haryana",
      },
      {
        code: "raj",
        name: "Rajasthani",
        nativeName: "राजस्थानी",
        flag: "🇮🇳",
        region: "Rajasthan",
      },
    ],
    [],
  );

  // Get recommended language based on browser locale
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    const recommended = languages.find((lang) => lang.code === browserLang);
    if (recommended && showRecommended) {
      setSelectedLanguage(recommended);
    }
  }, [languages, showRecommended]);

  // Filter languages based on search
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.includes(searchTerm) ||
      lang.region.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle language selection
  const handleSelectLanguage = async (language) => {
    setSelectedLanguage(language);
    // Change i18n language
    await i18n.changeLanguage(language.code);
    // Store in localStorage
    localStorage.setItem("preferredLanguage", language.code);

    if (onLanguageSelect) {
      onLanguageSelect(language);
    }
  };

  // Handle continue button
  const handleContinue = () => {
    if (selectedLanguage) {
      handleSelectLanguage(selectedLanguage);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="language-selector-container">
      <motion.div
        className="language-selector-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="selector-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="selector-title">🌍 Select Your Language</h1>
            <p className="selector-subtitle">
              Choose Your Preferred Language to Get Started
            </p>
            <p className="selector-description">
              You can change this anytime from Settings
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          className="search-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            className="language-search"
            placeholder="🔍 Search language or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Language Grid */}
        <motion.div
          className="languages-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredLanguages.map((language) => (
            <motion.div
              key={language.code}
              variants={cardVariants}
              whileHover="hover"
              className={`language-card ${selectedLanguage?.code === language.code ? "selected" : ""}`}
              onClick={() => handleSelectLanguage(language)}
            >
              <div className="language-flag">{language.flag}</div>
              <div className="language-info">
                <h3 className="language-name">{language.name}</h3>
                <p className="language-native">{language.nativeName}</p>
                <p className="language-region">{language.region}</p>
              </div>
              {selectedLanguage?.code === language.code && (
                <motion.div
                  className="selected-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* No results message */}
        {filteredLanguages.length === 0 && (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No languages found matching your search.</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="selector-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="btn-skip" onClick={onSkip}>
            Skip for Now
          </button>
          <button
            className={`btn-continue ${selectedLanguage ? "active" : "disabled"}`}
            onClick={handleContinue}
            disabled={!selectedLanguage}
          >
            Continue with {selectedLanguage?.name || "Selected Language"}
          </button>
        </motion.div>

        {/* Language Stats */}
        <motion.div
          className="language-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p>
            🌐 Supporting <strong>20 Indian Languages</strong> • 📱 Optimized
            for <strong>Rural Users</strong> • 🎯 Built for{" "}
            <strong>Indian Farmers</strong>
          </p>
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <div className="selector-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
    </div>
  );
};

export default LanguageSelector;
