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

// Enable CORS
app.use(cors());

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
