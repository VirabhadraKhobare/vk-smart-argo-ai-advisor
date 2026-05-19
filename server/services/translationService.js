/**
 * Translation Service
 * Handles all backend translation operations
 * Caches translations in memory for performance
 */

class TranslationService {
  constructor() {
    this.translations = {};
    this.cache = new Map();
    this.supportedLanguages = [
      "en",
      "hi",
      "mr",
      "kn",
      "ta",
      "te",
      "ml",
      "gu",
      "pa",
      "bn",
      "or",
      "ur",
      "as",
      "kok",
      "sa",
      "mni",
      "ne",
      "bho",
      "hry",
      "raj",
    ];
    this.defaultLanguage = "en";
    this.cacheExpiry = 1000 * 60 * 60; // 1 hour
  }

  /**
   * Initialize translations (call once on server startup)
   * In production, load from database or JSON files
   */
  async initialize() {
    try {
      // Load English translations as base
      this.translations["en"] = this.getDefaultTranslations();

      // Load other languages (implement based on your storage method)
      for (const lang of this.supportedLanguages) {
        if (lang !== "en") {
          this.translations[lang] = this.getDefaultTranslations();
        }
      }

      console.log("✅ Translation service initialized with all languages");
    } catch (error) {
      console.error("Error initializing translation service:", error);
    }
  }

  /**
   * Get default English translations (API messages)
   */
  getDefaultTranslations() {
    return {
      // API Messages
      "api.success": "Success",
      "api.error": "An error occurred",
      "api.unauthorized": "Unauthorized access",
      "api.forbidden": "Forbidden",
      "api.notFound": "Resource not found",
      "api.invalidRequest": "Invalid request",
      "api.serverError": "Internal server error",
      "api.validationError": "Validation error",

      // Auth Messages
      "auth.loginSuccess": "Login successful",
      "auth.loginFailed": "Invalid email or password",
      "auth.registerSuccess": "Registration successful",
      "auth.registerFailed": "Registration failed",
      "auth.logoutSuccess": "Logout successful",
      "auth.passwordChangeSuccess": "Password changed successfully",
      "auth.passwordChangeFailed": "Failed to change password",
      "auth.emailAlreadyExists": "Email already registered",
      "auth.invalidEmail": "Invalid email format",
      "auth.passwordTooShort": "Password must be at least 8 characters",
      "auth.passwordMismatch": "Passwords do not match",
      "auth.sessionExpired": "Session expired, please login again",

      // Crop Messages
      "crop.addedSuccess": "Crop added successfully",
      "crop.addedError": "Failed to add crop",
      "crop.updatedSuccess": "Crop updated successfully",
      "crop.updatedError": "Failed to update crop",
      "crop.deletedSuccess": "Crop deleted successfully",
      "crop.deletedError": "Failed to delete crop",
      "crop.notFound": "Crop not found",
      "crop.healthRecordedSuccess": "Health record added successfully",

      // Soil Messages
      "soil.reportAddedSuccess": "Soil report added successfully",
      "soil.reportAddedError": "Failed to add soil report",
      "soil.reportNotFound": "Soil report not found",
      "soil.analysisComplete": "Soil analysis complete",

      // Weather Messages
      "weather.fetchSuccess": "Weather data fetched successfully",
      "weather.fetchError": "Failed to fetch weather data",
      "weather.locationNotFound": "Location not found",

      // Disease Messages
      "disease.detectionSuccess": "Disease detection complete",
      "disease.detectionFailed": "Disease detection failed",
      "disease.noDisease": "No disease detected",
      "disease.alertCreatedSuccess": "Disease alert created successfully",

      // Yield Messages
      "yield.predictionSuccess": "Yield prediction complete",
      "yield.predictionFailed": "Yield prediction failed",
      "yield.profitCalculated": "Profit calculated successfully",

      // Chat Messages
      "chat.messageSentSuccess": "Message sent successfully",
      "chat.messageSendFailed": "Failed to send message",
      "chat.conversationDeleted": "Conversation deleted successfully",

      // Community Messages
      "community.postCreatedSuccess": "Post created successfully",
      "community.postDeletedSuccess": "Post deleted successfully",
      "community.commentAddedSuccess": "Comment added successfully",
      "community.commentDeletedSuccess": "Comment deleted successfully",
      "community.likeAdded": "Post liked",
      "community.likRemoved": "Like removed",

      // Notification Messages
      "notification.created": "Notification created",
      "notification.read": "Notification marked as read",
      "notification.deleted": "Notification deleted",

      // Settings Messages
      "settings.profileUpdatedSuccess": "Profile updated successfully",
      "settings.preferencesUpdatedSuccess": "Preferences updated successfully",
      "settings.languageChangedSuccess": "Language changed successfully",

      // Validation Messages
      "validation.fieldRequired": "This field is required",
      "validation.invalidFormat": "Invalid format",
      "validation.tooShort": "Too short",
      "validation.tooLong": "Too long",
      "validation.alreadyExists": "Already exists",
      "validation.notExists": "Does not exist",

      // Government Schemes
      "scheme.pmkisan": "PM-KISAN",
      "scheme.pmfby": "Pradhan Mantri Fasal Bima Yojana",
      "scheme.kcc": "Kisan Credit Card",
      "scheme.pmksy": "Pradhan Mantri Krishi Sinchayee Yojana",
    };
  }

  /**
   * Translate a key to specified language
   * @param {string} key - Translation key
   * @param {string} language - Language code
   * @param {object} params - Parameters for template substitution
   * @returns {string} Translated text
   */
  translate(key, language = "en", params = {}) {
    try {
      // Validate language
      if (!this.supportedLanguages.includes(language)) {
        language = this.defaultLanguage;
      }

      // Get translation
      const langTranslations =
        this.translations[language] || this.translations[this.defaultLanguage];
      let translation =
        langTranslations[key] ||
        langTranslations[`${this.defaultLanguage}.${key}`] ||
        key;

      // Substitute parameters
      if (params && typeof params === "object") {
        Object.keys(params).forEach((param) => {
          translation = translation.replace(`{{${param}}}`, params[param]);
        });
      }

      return translation;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  }

  /**
   * Translate an object of messages
   * @param {object} messages - Object with translation keys
   * @param {string} language - Language code
   * @returns {object} Translated messages
   */
  translateObject(messages, language = "en") {
    try {
      const translated = {};
      Object.keys(messages).forEach((key) => {
        translated[key] = this.translate(messages[key], language);
      });
      return translated;
    } catch (error) {
      console.error("Error translating object:", error);
      return messages;
    }
  }

  /**
   * Translate validation errors
   * @param {array} errors - Array of validation errors
   * @param {string} language - Language code
   * @returns {array} Translated errors
   */
  translateErrors(errors, language = "en") {
    try {
      return errors.map((error) => {
        const message = error.msg || error.message || error;
        const translatedMessage = this.translate(message, language);
        return {
          ...error,
          msg: translatedMessage,
          message: translatedMessage,
        };
      });
    } catch (error) {
      console.error("Error translating validation errors:", error);
      return errors;
    }
  }

  /**
   * Get supported languages list
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(language) {
    return this.supportedLanguages.includes(language);
  }

  /**
   * Cache a translation result
   */
  setCacheItem(key, language, value) {
    const cacheKey = `${key}:${language}`;
    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cached translation
   */
  getCacheItem(key, language) {
    const cacheKey = `${key}:${language}`;
    const item = this.cache.get(cacheKey);

    if (item && Date.now() - item.timestamp < this.cacheExpiry) {
      return item.value;
    }

    this.cache.delete(cacheKey);
    return null;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get language metadata
   */
  getLanguageInfo(languageCode) {
    const languages = {
      en: {
        name: "English",
        nativeName: "English",
        script: "Latin",
        rtl: false,
      },
      hi: {
        name: "Hindi",
        nativeName: "हिन्दी",
        script: "Devanagari",
        rtl: false,
      },
      mr: {
        name: "Marathi",
        nativeName: "मराठी",
        script: "Devanagari",
        rtl: false,
      },
      kn: {
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        script: "Kannada",
        rtl: false,
      },
      ta: { name: "Tamil", nativeName: "தமிழ்", script: "Tamil", rtl: false },
      te: {
        name: "Telugu",
        nativeName: "తెలుగు",
        script: "Telugu",
        rtl: false,
      },
      ml: {
        name: "Malayalam",
        nativeName: "മലയാളം",
        script: "Malayalam",
        rtl: false,
      },
      gu: {
        name: "Gujarati",
        nativeName: "ગુજરાતી",
        script: "Gujarati",
        rtl: false,
      },
      pa: {
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ",
        script: "Gurmukhi",
        rtl: false,
      },
      bn: {
        name: "Bengali",
        nativeName: "বাংলা",
        script: "Bengali",
        rtl: false,
      },
      or: { name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "Odia", rtl: false },
      ur: {
        name: "Urdu",
        nativeName: "اردو",
        script: "Perso-Arabic",
        rtl: true,
      },
      as: {
        name: "Assamese",
        nativeName: "অসমীয়া",
        script: "Bengali",
        rtl: false,
      },
      kok: {
        name: "Konkani",
        nativeName: "कोंकणी",
        script: "Devanagari",
        rtl: false,
      },
      sa: {
        name: "Sanskrit",
        nativeName: "संस्कृत",
        script: "Devanagari",
        rtl: false,
      },
      mni: {
        name: "Manipuri",
        nativeName: "ମଣିପୁରୀ",
        script: "Meitei",
        rtl: false,
      },
      ne: {
        name: "Nepali",
        nativeName: "नेपाली",
        script: "Devanagari",
        rtl: false,
      },
      bho: {
        name: "Bhojpuri",
        nativeName: "भोजपुरी",
        script: "Devanagari",
        rtl: false,
      },
      hry: {
        name: "Haryanvi",
        nativeName: "हरियाणवी",
        script: "Devanagari",
        rtl: false,
      },
      raj: {
        name: "Rajasthani",
        nativeName: "राजस्थानी",
        script: "Devanagari",
        rtl: false,
      },
    };

    return languages[languageCode] || languages["en"];
  }
}

// Create and export singleton instance
const translationService = new TranslationService();

module.exports = translationService;
