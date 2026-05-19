/**
 * Language Detection Middleware
 * Detects and sets the language for the current request
 * Supports: URL query parameter, Request header, User profile, Browser default
 */

const languageMiddleware = (req, res, next) => {
  try {
    // List of supported languages
    const supportedLanguages = [
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

    let detectedLanguage = "en"; // Default fallback

    // 1. Check URL query parameter (highest priority)
    if (req.query.lang && supportedLanguages.includes(req.query.lang)) {
      detectedLanguage = req.query.lang;
    }
    // 2. Check request header
    else if (
      req.headers["x-language"] &&
      supportedLanguages.includes(req.headers["x-language"])
    ) {
      detectedLanguage = req.headers["x-language"];
    }
    // 3. Check Accept-Language header
    else if (req.headers["accept-language"]) {
      const acceptLanguage = req.headers["accept-language"]
        .split(",")[0]
        .split("-")[0];
      if (supportedLanguages.includes(acceptLanguage)) {
        detectedLanguage = acceptLanguage;
      }
    }
    // 4. Check user profile if authenticated
    if (
      req.user &&
      req.user.language &&
      supportedLanguages.includes(req.user.language)
    ) {
      detectedLanguage = req.user.language;
    }

    // Set language on request object
    req.language = detectedLanguage;
    req.i18n = {
      language: detectedLanguage,
      supportedLanguages,
    };

    // Add language to response headers
    res.setHeader("Content-Language", detectedLanguage);
    res.setHeader("X-Language", detectedLanguage);

    // Log language detection
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Language Detection] ${req.method} ${req.path} - Language: ${detectedLanguage}`,
      );
    }

    next();
  } catch (error) {
    console.error("Language middleware error:", error);
    req.language = "en";
    next();
  }
};

module.exports = languageMiddleware;
