/**
 * Smart Agro AI Advisor - Main Server
 * Express.js application with MongoDB integration
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Database connection
const connectDB = require("./config/db");

// Middleware
const errorHandler = require("./middleware/errorHandler");
const { handleUploadError } = require("./middleware/upload");

// Route imports
const authRoutes = require("./routes/authRoutes");
const cropRoutes = require("./routes/cropRoutes");
const soilRoutes = require("./routes/soilRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const yieldRoutes = require("./routes/yieldRoutes");
const communityRoutes = require("./routes/communityRoutes");
const chatRoutes = require("./routes/chatRoutes");
const govRoutes = require("./routes/govRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Initialize Express app
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// CORS configuration - Production-safe whitelist approach
const parseOriginList = (value = '') =>
  value
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseOriginList(process.env.CLIENT_URL),
  ...parseOriginList(process.env.CORS_ORIGINS),
];
const uniqueAllowedOrigins = [...new Set(allowedOrigins)];
const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (server-to-server)
    if (!origin) return callback(null, true);

    // In development, always allow localhost-based frontends so local client ports work.
    if (isDevelopment && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // If no explicit origins are configured, allow all origins in development only.
    if (uniqueAllowedOrigins.length === 0) {
      if (isDevelopment) {
        console.log('⚠️  CORS: No origin list configured. Allowing all origins (dev mode)');
        return callback(null, true);
      }

      console.warn(`❌ CORS rejected origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }

    // Check if origin is in whitelist
    if (uniqueAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS rejected origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS
app.use(cors(corsOptions));
// Enable preflight for all routes
app.options('*', cors(corsOptions));

/* =========================================================
   RATE LIMITER
========================================================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/yield', yieldRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/government', govRoutes);
app.use('/api/notifications', notificationRoutes);

/* =========================================================
   UPLOAD ERROR HANDLER
========================================================= */

app.use(handleUploadError);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandler);

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌾 Smart Agro AI Advisor Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS whitelist: ${uniqueAllowedOrigins.length > 0 ? JSON.stringify(uniqueAllowedOrigins) : 'All origins (dev mode)'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
