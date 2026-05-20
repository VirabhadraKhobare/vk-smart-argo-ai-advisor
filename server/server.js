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

// Connect to database
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

// CORS configuration
// CORS: use a dynamic whitelist so we can allow credentials safely
const clientUrl = process.env.CLIENT_URL || '';
const whitelist = clientUrl
  ? clientUrl.split(',').map((s) => s.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser requests (like server-to-server) when origin is undefined
    if (!origin) return callback(null, true);
    // if no whitelist configured, allow all origins (useful for local/dev)
    if (whitelist.length === 0) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
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

// Upload error handler
app.use(handleUploadError);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🌾 Smart Agro AI Advisor Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
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
