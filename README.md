# 🌾 Smart Agro AI Advisor

**AI-Powered Precision Farming & Crop Intelligence Platform**

A comprehensive full-stack web application designed to empower farmers with AI-driven insights for crop management, soil health analysis, yield prediction, weather forecasting, disease detection, and access to government schemes.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 Authentication System
- User Registration & Login with JWT
- Role-based access (Farmer / Admin)
- Secure password hashing with bcrypt
- Profile management

### 📊 Dashboard
- Real-time crop health monitoring
- Irrigation status tracking
- Estimated yield & profit analytics
- Weather overview
- AI-generated daily tasks
- Interactive charts (Recharts)
- Disease alerts counter

### 🌱 Crop Analysis
- Add and manage multiple crops
- Health score tracking with history
- Growth stage monitoring
- Field block management
- AI recommendations

### 🌍 Soil Health
- NPK (Nitrogen, Phosphorus, Potassium) tracking
- pH level monitoring
- Moisture analysis
- Organic matter assessment
- AI fertilizer recommendations
- Soil test history

### 📈 Yield Prediction
- AI-powered yield estimation
- Profit prediction based on market prices
- Input parameters: crop type, soil quality, rainfall, temperature
- Confidence scoring
- Recommendation engine

### 🌦️ Weather Integration
- Real-time weather data (OpenWeatherMap API)
- 7-day forecast
- Smart irrigation suggestions
- Agricultural weather insights

### 🔬 Disease Detection
- Image upload for AI analysis
- Mock AI disease identification
- Confidence scoring
- Treatment recommendations (organic & chemical)
- Severity assessment

### 🤖 AI Chat Assistant
- Conversational AI for farming queries
- Knowledge base for crops, soil, weather, pests
- Suggested questions
- Chat history

### 🏛️ Government Schemes
- PM-KISAN, PMFBY, KCC, PMKSY, and more
- Search and filter functionality
- Eligibility criteria
- Application process documentation
- Contact information

### 👥 Community Forum
- Create and share posts
- Like and comment system
- Category-based filtering
- Real-time discussions

### ⚙️ Settings
- Profile update
- Password change
- Dark/Light mode toggle
- Notification preferences
- Language selection

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI library
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - Bootstrap React components
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **express-rate-limit** - Rate limiting

---

## 📁 Project Structure

```
smart-agro-ai-advisor/
│
├── client/                          # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── AlertBanner.js
│   │   │   ├── Charts.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Sidebar.js
│   │   │   ├── StatCard.js
│   │   │   └── TopNavbar.js
│   │   ├── context/               # React Context
│   │   │   ├── AuthContext.js
│   │   │   ├── NotificationContext.js
│   │   │   └── ThemeContext.js
│   │   ├── hooks/                 # Custom hooks
│   │   │   ├── useApi.js
│   │   │   ├── useAuth.js
│   │   │   └── useForm.js
│   │   ├── layouts/               # Layout components
│   │   │   └── DashboardLayout.js
│   │   ├── pages/                 # Page components
│   │   │   ├── AIAssistant.js
│   │   │   ├── Community.js
│   │   │   ├── CropAnalysis.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DiseaseDetection.js
│   │   │   ├── GovernmentSchemes.js
│   │   │   ├── Login.js
│   │   │   ├── NotFound.js
│   │   │   ├── Register.js
│   │   │   ├── Settings.js
│   │   │   ├── SoilHealth.js
│   │   │   ├── Weather.js
│   │   │   └── YieldPrediction.js
│   │   ├── routes/                # Route configuration
│   │   │   └── AppRoutes.js
│   │   ├── services/              # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   ├── communityService.js
│   │   │   ├── cropService.js
│   │   │   ├── diseaseService.js
│   │   │   ├── govService.js
│   │   │   ├── notificationService.js
│   │   │   ├── soilService.js
│   │   │   ├── weatherService.js
│   │   │   └── yieldService.js
│   │   ├── styles/                # Global styles
│   │   │   └── global.css
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # Entry point
│   ├── package.json
│   └── .env.example
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   └── db.js                   # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── communityController.js
│   │   ├── cropController.js
│   │   ├── diseaseController.js
│   │   ├── govController.js
│   │   ├── notificationController.js
│   │   ├── soilController.js
│   │   ├── weatherController.js
│   │   └── yieldController.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication
│   │   ├── errorHandler.js         # Error handling
│   │   └── upload.js               # File upload config
│   ├── models/
│   │   ├── ChatMessage.js
│   │   ├── CommunityPost.js
│   │   ├── Crop.js
│   │   ├── DiseaseAlert.js
│   │   ├── GovernmentScheme.js
│   │   ├── Notification.js
│   │   ├── SoilReport.js
│   │   ├── User.js
│   │   ├── WeatherData.js
│   │   └── YieldPrediction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── diseaseRoutes.js
│   │   ├── govRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── soilRoutes.js
│   │   ├── weatherRoutes.js
│   │   └── yieldRoutes.js
│   ├── uploads/                    # File upload directory
│   ├── utils/
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Entry point
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- OpenWeatherMap API key (optional, uses mock data if not provided)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-agro-ai-advisor.git
cd smart-agro-ai-advisor
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

#### Backend (.env)
```bash
cd ../server
cp .env.example .env
# Edit .env with your credentials
```

#### Frontend (.env)
```bash
cd ../client
cp .env.example .env
# Edit .env with your API URL
```

### 5. Run the Application

#### Start Backend (Development)
```bash
cd server
npm run dev
```

#### Start Frontend (Development)
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-agro
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
WEATHER_API_KEY=your_openweather_api_key
MAX_FILE_SIZE=5242880
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Smart Agro AI Advisor
```

---

## 📚 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/update-profile | Update profile |
| PUT | /api/auth/change-password | Change password |

### Crops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/crops | Get all crops |
| GET | /api/crops/:id | Get single crop |
| POST | /api/crops | Create crop |
| PUT | /api/crops/:id | Update crop |
| DELETE | /api/crops/:id | Delete crop |
| PUT | /api/crops/:id/health | Update health |

### Soil Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/soil | Get reports |
| GET | /api/soil/latest | Get latest report |
| POST | /api/soil | Create report |

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/weather/current | Current weather |
| GET | /api/weather/forecast | Forecast |
| GET | /api/weather/irrigation-suggestion | Irrigation advice |

### Disease Detection
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/disease/detect | Upload & detect |
| GET | /api/disease/alerts | Get alerts |

### Yield Prediction
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/yield/predict | Predict yield |
| GET | /api/yield | Get predictions |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/community | Get posts |
| POST | /api/community | Create post |
| POST | /api/community/:id/like | Like post |
| POST | /api/community/:id/comments | Add comment |

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy build/ folder to Vercel
```

### Backend (Render)
```bash
cd server
# Set environment variables in Render dashboard
# Deploy from GitHub repository
```

### MongoDB Atlas
1. Create cluster at mongodb.com
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Add to MONGODB_URI in .env

---

## 📸 Screenshots

### Dashboard
Modern SaaS dashboard with real-time widgets, charts, and AI recommendations.

### Crop Analysis
Comprehensive crop management with health tracking and growth analytics.

### Soil Health
Detailed soil nutrient analysis with AI-powered fertilizer recommendations.

### AI Chat Assistant
ChatGPT-like interface for farming queries with intelligent responses.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- Bootstrap team for the excellent CSS framework
- React community for amazing tools and libraries

---

**Built with ❤️ for Indian Farmers**

For support, contact: support@smartagro.ai
