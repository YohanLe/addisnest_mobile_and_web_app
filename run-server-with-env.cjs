/**
 * This script runs the server with proper environment configuration
 * Run with: node run-server-with-env.cjs
 */

// Since we're working with a CommonJS server in an ES Module project,
// this file uses the .cjs extension to explicitly indicate it's using CommonJS format

// Load environment variables first
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './addisnest-backend/.env') });

// Now that environment variables are loaded, start the server
console.log('🔄 Starting server with environment variables loaded...');
console.log(`📊 MongoDB URI: ${process.env.MONGODB_URI ? 'Found' : 'Not found'}`);
console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Found' : 'Not found'}`);
console.log(`🌐 PORT: ${process.env.PORT || 7000}`);

// Start the server by requiring it
require('./addisnest-backend/server');
