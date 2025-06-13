/**
 * Fixed Homepage Properties Launcher
 * 
 * This script launches the application with the proper configuration to ensure
 * all properties are displayed on the homepage.
 */

const { spawn } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

console.log('====== FIXED HOMEPAGE PROPERTIES LAUNCHER ======');

// Ensure the MongoDB connection is configured correctly
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/addinest';
process.env.MONGODB_URI = MONGODB_URI;

// Set consistent port configuration
const PORT = process.env.PORT || 7000;
process.env.PORT = PORT;

// Set the API URL and base URL for the frontend
process.env.VITE_API_URL = `http://localhost:${PORT}/api`;
process.env.VITE_API_BASE_URL = `http://localhost:${PORT}/api`;

// Set properties display flag
process.env.SHOW_ALL_PROPERTIES = 'true';

console.log('Environment Configuration:');
console.log('- MongoDB URI:', MONGODB_URI);
console.log('- API Port:', PORT);
console.log('- API URL:', process.env.VITE_API_URL);
console.log('- Show All Properties:', process.env.SHOW_ALL_PROPERTIES);

// Check database connectivity before starting the server
console.log('\nChecking database connectivity...');
const mongoose = require('mongoose');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ MongoDB connected successfully.');
  
  try {
    // Import models
    const Property = require('./src/models/Property');
    
    // Check if there are properties in the database
    const propertyCount = await Property.countDocuments();
    console.log(`Found ${propertyCount} properties in database.`);
    
    if (propertyCount === 0) {
      console.log('No properties found in the database.');
      console.log('Seeding the database with sample properties...');
      
      // Run the seed script
      try {
        await mongoose.connection.close();
        await new Promise((resolve, reject) => {
          const seedProcess = spawn('node', ['seed-database-properties.js'], { stdio: 'inherit' });
          seedProcess.on('close', resolve);
          seedProcess.on('error', reject);
        });
        console.log('✅ Database seeded successfully.');
      } catch (seedError) {
        console.error('❌ Error seeding database:', seedError);
      }
    }
    
    // Start the server
    console.log('\nStarting server...');
    const serverProcess = spawn('node', ['src/server.js'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: PORT,
        NODE_ENV: 'development',
        MONGODB_URI: MONGODB_URI,
        SHOW_ALL_PROPERTIES: 'true'
      }
    });
    
    console.log(`Server process started with PID: ${serverProcess.pid}`);
    
    // Start the frontend application after a short delay
    setTimeout(() => {
      console.log('\nStarting frontend application...');
      
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        env: {
          ...process.env,
          VITE_API_URL: `http://localhost:${PORT}/api`,
          VITE_API_BASE_URL: `http://localhost:${PORT}/api`,
          SHOW_ALL_PROPERTIES: 'true'
        }
      });
      
      console.log(`Frontend process started with PID: ${frontendProcess.pid}`);
      
      // Handle cleanup when the script is terminated
      const cleanup = () => {
        console.log('\nCleaning up processes...');
        if (serverProcess && !serverProcess.killed) {
          serverProcess.kill();
          console.log('Server process terminated');
        }
        if (frontendProcess && !frontendProcess.killed) {
          frontendProcess.kill();
          console.log('Frontend process terminated');
        }
        process.exit(0);
      };
      
      // Register cleanup handlers
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      process.on('exit', cleanup);
      
      console.log('\n');
      console.log('='.repeat(80));
      console.log('APPLICATION STARTED WITH HOMEPAGE PROPERTIES FIX');
      console.log('-'.repeat(80));
      console.log('Fixes applied:');
      console.log('1. Enhanced debugging for property data flow');
      console.log('2. Optimized API request parameters');
      console.log('3. Updated UI to display all properties');
      console.log('4. Consistent environment configuration');
      console.log('='.repeat(80));
      console.log('\n');
      console.log('Access the application at: http://localhost:3000');
      console.log('\n');
      
    }, 3000);
    
  } catch (error) {
    console.error('Error checking database properties:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
