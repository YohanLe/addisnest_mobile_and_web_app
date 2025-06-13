/**
 * Enhanced server.js with MongoDB ID lookup fix enabled
 * 
 * This version explicitly enables the MongoDB ID lookup routes and ensures
 * they bypass authentication correctly.
 */

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes-mongo-id-fix'); // Use the fixed version
const propertySubmitRoute = require('./routes/propertySubmitRoute');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const connectionTestRoutes = require('./routes/connectionTestRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Force using local MongoDB connection
process.env.MONGO_URI = 'mongodb://localhost:27017/addisnest';
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('Port:', process.env.PORT);
console.log('MongoDB ID lookup fix: ENABLED');

// Connect to database
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/'
});

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');
  
  // Send initial connection confirmation
  ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  
  // Handle incoming messages
  ws.on('message', function incoming(message) {
    console.log('Received message:', message.toString());
    
    try {
      const parsedMessage = JSON.parse(message);
      
      // Handle different message types
      switch(parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        default:
          console.log('Unhandled message type:', parsedMessage.type);
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err);
    }
  });
  
  // Handle connection close
  ws.on('close', function() {
    console.log('WebSocket client disconnected');
  });
});

// Request logging middleware with enhanced details for debugging
app.use((req, res, next) => {
  const authHeader = req.headers.authorization || 'none';
  console.log(`${req.method} ${req.path} (Auth: ${authHeader.substring(0, 20)}${authHeader.length > 20 ? '...' : ''})`);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS with options for better debugging
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// File upload middleware
app.use(fileUpload({
  createParentPath: true
}));

// Set static folders
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/properties', express.static(path.join(__dirname, '../uploads/properties')));
app.use(express.static(path.join(__dirname, 'public')));

// Add a special public test endpoint to verify server is working correctly
app.get('/api/test-public', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Public endpoint is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Add special handling for property routes
console.log('Mounting property routes with MongoDB ID lookup fix enabled');
app.use('/api/properties', propertyRoutes);

app.use('/api/property-submit', propertySubmitRoute);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/connectiontests', connectionTestRoutes);
app.use('/api/media', mediaRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running with MongoDB ID lookup fix enabled'
  });
});

// Enhanced error handling middleware with better debugging info
app.use((err, req, res, next) => {
  // Log the full error details
  console.error('=== SERVER ERROR ===');
  console.error(`Error in ${req.method} ${req.path}`);
  console.error('Request headers:', req.headers);
  console.error('Request params:', req.params);
  console.error('Request query:', req.query);
  console.error('Request body:', req.body);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode || 500
  });
  console.error('Stack trace:', err.stack);
  console.error('===================');
  
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
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  console.log(`MongoDB ID lookup fix is ENABLED`.green.bold);
  console.log(`Test public endpoint at: http://localhost:${PORT}/api/test-public`.cyan);
  console.log(`Test MongoDB ID endpoint at: http://localhost:${PORT}/api/properties/mongo-id/684a5fb17cb3172bbb3c75d7`.cyan);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
