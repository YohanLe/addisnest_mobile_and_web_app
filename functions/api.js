const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Import routes
const routes = require('../src/routes');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Enable CORS with specific configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any subdomain of netlify.app
    if (origin.endsWith('netlify.app') || origin.includes('--addisnesttest.netlify.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Add your production domain here if needed
    if (origin === 'https://addisnesttest.netlify.app') {
      return callback(null, true);
    }
    
    callback(null, true); // Temporarily allow all origins while debugging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Set additional CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser
app.use(express.json());

// Database connection - with error handling
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variable
    const mongoUri = process.env.MONGO_URI;
    
    // Check if the MongoDB URI has a database name
    const hasDBName = mongoUri.split('/').length > 3;
    
    // Add database name if missing
    const connectionString = hasDBName ? mongoUri : `${mongoUri}/addisnest`;
    
    console.log('Connecting to MongoDB with URI:', connectionString.replace(/:[^\/]+@/, ':****@'));
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

// Set up routes
app.use('/api/agents', routes.agentRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/auth', routes.authRoutes);
app.use('/api/properties', routes.propertyRoutes);
app.use('/api/property-submit', routes.propertySubmitRoute);
app.use('/api/conversations', routes.conversationRoutes);
app.use('/api/messages', routes.messageRoutes);
app.use('/api/notifications', routes.notificationRoutes);
app.use('/api/payments', routes.paymentRoutes);
app.use('/api/connectiontests', routes.connectionTestRoutes);
app.use('/api/media', routes.mediaRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Addisnest API is running'
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  // Format validation errors from Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
      details: err.errors
    });
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate field value entered: ${field}`,
      field
    });
  }
  
  // Return appropriate error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Create serverless handler
const handler = serverless(app);

// Wrap the handler to ensure MongoDB is connected
exports.handler = async (event, context) => {
  // Make sure MongoDB is connected before handling the request
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Connect to database if not already connected
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  
  // Handle the request
  return handler(event, context);
};
