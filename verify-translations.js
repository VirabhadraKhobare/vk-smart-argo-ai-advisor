#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// First, run the generator
console.log("🚀 Starting translation file generation...\n");

// Define all languages
const languages = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  kn: "Kannada",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  gu: "Gujarati",
  pa: "Punjabi",
  bn: "Bengali",
  or: "Odia",
  ur: "Urdu",
  as: "Assamese",
  kok: "Konkani",
  sa: "Sanskrit",
  mni: "Manipuri",
  ne: "Nepali",
  bho: "Bhojpuri",
  hry: "Haryanvi",
  raj: "Rajasthani",
};

// Translation keys and English versions
const translationTemplates = {
  common: {
    welcome: "Welcome",
    appName: "Smart Agro AI Advisor",
    home: "Home",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    register: "Register",
    signup: "Sign Up",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    close: "Close",
    yes: "Yes",
    no: "No",
    confirm: "Confirm",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    state: "State",
    district: "District",
    language: "Language",
    selectLanguage: "Select Your Preferred Language",
    chooseLanguage: "Choose Language",
    languageChanged: "Language changed successfully",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    notifications: "Notifications",
    noNotifications: "No notifications",
    viewAll: "View All",
    markAsRead: "Mark as Read",
    help: "Help",
    about: "About",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    copyright: "© 2024 Smart Agro AI Advisor. All rights reserved.",
    platformForFarmers:
      "AI-Powered Precision Farming Platform for Indian Farmers",
    version: "Version",
  },
  auth: {
    login: "Login",
    register: "Register",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    enterConfirmPassword: "Confirm your password",
    firstName: "First Name",
    lastName: "Last Name",
    farmSize: "Farm Size (in acres)",
    crops: "Crops Grown",
    state: "State",
    district: "District",
    village: "Village",
    rememberMe: "Remember Me",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    signUpNow: "Sign Up Now",
    loginNow: "Login Now",
    invalidEmail: "Please enter a valid email",
    passwordTooShort: "Password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
    emailAlreadyExists: "Email already registered",
    loginSuccess: "Login successful!",
    registerSuccess: "Registration successful! Please login.",
    loginFailed: "Invalid email or password",
    resetLinkSent: "Password reset link sent to your email",
    passwordReset: "Password reset successful",
    logout: "Logout",
    areYouSure: "Are you sure you want to logout?",
  },
  dashboard: {
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    overallHealth: "Overall Crop Health",
    activeAlerts: "Active Alerts",
    totalCrops: "Total Crops",
    irrigationStatus: "Irrigation Status",
    estimatedYield: "Estimated Yield",
    estimatedProfit: "Estimated Profit",
    weatherOverview: "Weather Overview",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    windSpeed: "Wind Speed",
    soilMoisture: "Soil Moisture",
    airQuality: "Air Quality",
    recentActivity: "Recent Activity",
    noRecentActivity: "No recent activity",
    quickActions: "Quick Actions",
    addCrop: "Add Crop",
    recordHealth: "Record Health",
    checkDisease: "Check Disease",
    viewAnalytics: "View Analytics",
  },
  crops: {
    crops: "Crops",
    myCrops: "My Crops",
    addCrop: "Add Crop",
    cropName: "Crop Name",
    cropType: "Crop Type",
    plantingDate: "Planting Date",
    expectedHarvestDate: "Expected Harvest Date",
    fieldArea: "Field Area (in acres)",
    fieldName: "Field Name",
    soilType: "Soil Type",
    variety: "Variety",
    seedWeight: "Seed Weight (kg)",
    spacing: "Spacing (in cm)",
    healthScore: "Health Score",
    growthStage: "Growth Stage",
    seedling: "Seedling",
    vegetative: "Vegetative",
    flowering: "Flowering",
    fruiting: "Fruiting",
    maturity: "Maturity",
    harvest: "Harvest",
    recordHealth: "Record Health",
    healthHistory: "Health History",
    noCrops: "No crops added yet",
    cropAddedSuccess: "Crop added successfully",
    cropUpdatedSuccess: "Crop updated successfully",
    cropDeletedSuccess: "Crop deleted successfully",
  },
  soil: {
    soil: "Soil",
    soilHealth: "Soil Health",
    soilReport: "Soil Report",
    npk: "NPK Analysis",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    phLevel: "pH Level",
    organicMatter: "Organic Matter",
    moisture: "Moisture",
    conductivity: "Electrical Conductivity",
    soilType: "Soil Type",
    texture: "Texture",
    color: "Color",
    depth: "Depth",
    recordDate: "Record Date",
    recommendation: "Recommendation",
    fertilizerRecommendation: "Fertilizer Recommendation",
    nRecommendation: "Recommended Nitrogen",
    pRecommendation: "Recommended Phosphorus",
    kRecommendation: "Recommended Potassium",
    noSoilData: "No soil data available",
  },
  weather: {
    weather: "Weather",
    currentWeather: "Current Weather",
    forecast: "Forecast",
    today: "Today",
    tomorrow: "Tomorrow",
    temperature: "Temperature",
    minTemp: "Min Temperature",
    maxTemp: "Max Temperature",
    humidity: "Humidity",
    pressure: "Pressure",
    windSpeed: "Wind Speed",
    windDirection: "Wind Direction",
    rainfall: "Rainfall",
    cloudCover: "Cloud Cover",
    uvIndex: "UV Index",
    visibility: "Visibility",
    irrigationAdvice: "Irrigation Advice",
    irrigationNeeded: "Irrigation Needed",
    irrigationNotNeeded: "Irrigation Not Needed",
    rainfallExpected: "Rainfall Expected",
    location: "Location",
  },
  disease: {
    disease: "Disease",
    diseaseDetection: "Disease Detection",
    detectDisease: "Detect Disease",
    uploadImage: "Upload Image",
    takePhoto: "Take Photo",
    selectImage: "Select Image",
    diseaseName: "Disease Name",
    confidence: "Confidence",
    severity: "Severity",
    low: "Low",
    medium: "Medium",
    high: "High",
    treatment: "Treatment",
    organicTreatment: "Organic Treatment",
    chemicalTreatment: "Chemical Treatment",
    prevention: "Prevention",
    precaution: "Precaution",
    diseaseAlerts: "Disease Alerts",
    noAlertsFound: "No disease alerts",
    diseaseHistory: "Disease History",
    detectionResult: "Detection Result",
    accuracy: "Accuracy",
  },
  yield: {
    yield: "Yield",
    yieldPrediction: "Yield Prediction",
    predictYield: "Predict Yield",
    expectedYield: "Expected Yield",
    unit: "Unit (Quintals/Acre)",
    marketPrice: "Market Price",
    estimatedProfit: "Estimated Profit",
    factors: "Factors Affecting Yield",
    soilQuality: "Soil Quality",
    waterAvailability: "Water Availability",
    rainfall: "Rainfall",
    temperature: "Temperature",
    pestControl: "Pest Control",
    varietyUsed: "Variety Used",
    confidence: "Confidence Level",
    inputs: "Inputs",
    cropType: "Crop Type",
    noYieldData: "No yield prediction available",
  },
  chat: {
    aiAssistant: "AI Assistant",
    askQuestion: "Ask your question...",
    typeMessage: "Type your message...",
    suggestedQuestions: "Suggested Questions",
    noMessages: "No messages yet. Start asking your questions!",
    chatHistory: "Chat History",
    clearHistory: "Clear History",
    helpTopics: "Help Topics",
    cropManagement: "Crop Management",
    soilManagement: "Soil Management",
    weatherAdvice: "Weather Advice",
    diseaseControl: "Disease Control",
    yieldOptimization: "Yield Optimization",
  },
  community: {
    community: "Community",
    communityForum: "Community Forum",
    createPost: "Create Post",
    postTitle: "Post Title",
    postContent: "Post Content",
    category: "Category",
    like: "Like",
    unlike: "Unlike",
    comment: "Comment",
    reply: "Reply",
    share: "Share",
    likes: "Likes",
    comments: "Comments",
    shares: "Shares",
    noPostsFound: "No posts found",
    postCreatedSuccess: "Post created successfully",
    postDeletedSuccess: "Post deleted successfully",
  },
  government: {
    government: "Government",
    governmentSchemes: "Government Schemes",
    pmKisan: "PM-KISAN",
    pmfby: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    kcc: "Kisan Credit Card (KCC)",
    pmksy: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    eligibilityCriteria: "Eligibility Criteria",
    benefitsAmount: "Benefits & Amount",
    applicationProcess: "Application Process",
    requiredDocuments: "Required Documents",
    contactInfo: "Contact Information",
    applyNow: "Apply Now",
    learnMore: "Learn More",
  },
  settings: {
    settings: "Settings",
    account: "Account",
    preferences: "Preferences",
    security: "Security",
    privacy: "Privacy",
    notifications: "Notifications",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    updateProfile: "Update Profile",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    twoFactorAuth: "Two Factor Authentication",
    dataPrivacy: "Data Privacy",
    deleteAccount: "Delete Account",
    settingsSavedSuccess: "Settings saved successfully",
  },
  notifications: {
    notifications: "Notifications",
    newDiseaseAlert: "New Disease Alert",
    weatherWarning: "Weather Warning",
    irrigationReminder: "Irrigation Reminder",
    fertiliserDue: "Fertiliser Application Due",
    pestAlert: "Pest Alert",
    harvestReminder: "Harvest Reminder",
    yieldPredictionReady: "Yield Prediction Ready",
    soilTestDue: "Soil Test Due",
    marketPriceUpdate: "Market Price Update",
    schemesOpened: "New Government Schemes Opened",
    markAllAsRead: "Mark All as Read",
    deleteAllNotifications: "Delete All Notifications",
  },
  errors: {
    errorOccurred: "An error occurred",
    tryAgain: "Please try again",
    somethingWentWrong: "Something went wrong",
    unauthorized: "Unauthorized",
    forbidden: "Forbidden",
    notFound: "Not Found",
    pageNotFound: "Page Not Found",
    serverError: "Server Error",
    networkError: "Network Error",
    loadingFailed: "Loading failed",
    sessionExpired: "Session expired. Please login again",
    invalidRequest: "Invalid request",
    fileNotSupported: "File type not supported",
    fileTooLarge: "File size too large",
  },
  validation: {
    fieldRequired: "This field is required",
    invalidEmail: "Please enter a valid email",
    invalidPhone: "Please enter a valid phone number",
    passwordTooShort: "Password must be at least 8 characters",
    passwordWeak: "Password is too weak",
    passwordMismatch: "Passwords do not match",
    minLength: "Must be at least {{count}} characters",
    maxLength: "Must not exceed {{count}} characters",
    onlyNumbers: "Only numbers are allowed",
    onlyLetters: "Only letters are allowed",
    invalidFormat: "Invalid format",
    selectAtLeastOne: "Please select at least one option",
    acceptTerms: "You must accept the terms and conditions",
  },
};

// Function to create a translation object with dummy translations
function createTranslationObject(namespace) {
  const translations = {};
  const englishTranslations = translationTemplates[namespace] || {};

  for (const [key, value] of Object.entries(englishTranslations)) {
    translations[key] = value;
  }

  return translations;
}

// Function to create directory recursively
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

// Create all translation files
console.log("🔧 Creating translation files for all languages...\n");

const baseLocalesPath = path.join(__dirname, "client", "src", "locales");

for (const [langCode, langName] of Object.entries(languages)) {
  console.log(`📝 Creating translations for ${langName} (${langCode})`);

  for (const namespace of Object.keys(translationTemplates)) {
    const filePath = path.join(baseLocalesPath, langCode, `${namespace}.json`);
    ensureDirectoryExists(filePath);

    const translations = createTranslationObject(namespace);
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), "utf8");
  }

  console.log(`✅ Completed ${langName}\n`);
}

console.log("✨ All translation files created successfully!");
console.log("\n📊 VERIFICATION REPORT:");
console.log("================================");

// Now verify
let totalFiles = 0;
let languageCount = 0;

for (const [langCode, langName] of Object.entries(languages)) {
  const langPath = path.join(baseLocalesPath, langCode);
  if (fs.existsSync(langPath)) {
    languageCount++;
    const files = fs.readdirSync(langPath);
    const jsonCount = files.filter((f) => f.endsWith(".json")).length;
    totalFiles += jsonCount;
    console.log(`✓ ${langCode.padEnd(6)} (${langName.padEnd(15)}) - ${jsonCount} files`);
  }
}

console.log("================================");
console.log(`\n📈 SUMMARY:`);
console.log(`  • Language directories created: ${languageCount}/20`);
console.log(`  • Total translation files: ${totalFiles}/280`);
console.log(`  • Expected namespace files per language: 14`);

// List namespaces
const namespaces = Object.keys(translationTemplates);
console.log(`\n📋 Namespace files (${namespaces.length}):`);
namespaces.forEach((ns, idx) => {
  console.log(`   ${idx + 1}. ${ns}.json`);
});

console.log(`\n✅ GENERATION COMPLETE!`);
