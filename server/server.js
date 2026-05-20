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
const connectDB = require('./config/db');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const { handleUploadError } = require('./middleware/upload');

// Route imports
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const soilRoutes = require('./routes/soilRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const yieldRoutes = require('./routes/yieldRoutes');
const communityRoutes = require('./routes/communityRoutes');
const chatRoutes = require('./routes/chatRoutes');
const govRoutes = require('./routes/govRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Express app
const app = express();

// Connect Database
connectDB();

/* =========================================================
   SECURITY MIDDLEWARE
========================================================= */

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

/* =========================================================
   CORS CONFIGURATION
========================================================= */

// Allowed frontend URLs from .env
const clientUrl = process.env.CLIENT_URL || '';

const allowedOrigins = clientUrl
  ? clientUrl.split(',').map((url) => url.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    // (mobile apps, postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost during development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    // Allow all Vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow manually configured origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS Blocked Origin: ${origin}`);

    return callback(null, false);
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],

  optionsSuccessStatus: 200
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

/* =========================================================
   RATE LIMITER
========================================================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.'
  }
});

app.use('/api/', limiter);

/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =========================================================
   LOGGING
========================================================= */

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* =========================================================
   STATIC FILES
========================================================= */

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/* =========================================================
   API ROUTES
========================================================= */

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
    message: `Route ${req.originalUrl} not found`
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
  console.log('=======================================');
  console.log(`🌾 Smart Agro AI Advisor Server Running`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `🔐 Allowed Origins: ${
      allowedOrigins.length > 0
        ? allowedOrigins.join(', ')
        : 'All Origins Allowed'
    }`
  );
  console.log('=======================================');
});

/* =========================================================
   HANDLE UNCAUGHT ERRORS
========================================================= */

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);

  server.close(() => {
    process.exit(1);
  });
});

// Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);

  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
