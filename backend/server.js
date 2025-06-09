const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load env vars
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

// Set default values for required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 5000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-feedback';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_key_do_not_use_in_production';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '30';

// Debug environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('JWT_COOKIE_EXPIRE:', process.env.JWT_COOKIE_EXPIRE);

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://student-feedback-frontend1.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable CORS with options
app.use(cors(corsOptions));

// Handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://student-feedback-frontend1.onrender.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
    },
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// Prevent XSS attacks
app.use(xss());

// Sanitize data
app.use(mongoSanitize());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root route handler
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Feedback System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      feedback: '/api/feedback',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Connect to database
connectDB();

// Create test user if it doesn't exist
const createTestUser = async () => {
  try {
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      const newUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123',
        role: 'teacher',
        firstName: 'Test',
        lastName: 'User',
        department: 'Computer Science'
      });
      console.log('Test user created:', newUser.email);
      // Generate token for test user
      const token = newUser.getSignedJwtToken();
      console.log('Test user token:', token);
    } else {
      console.log('Test user already exists');
      // Generate token for existing test user
      const token = testUser.getSignedJwtToken();
      console.log('Test user token:', token);
    }
  } catch (err) {
    console.error('Error creating test user:', err);
  }
};

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  // Create test user after server starts
  await createTestUser();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});