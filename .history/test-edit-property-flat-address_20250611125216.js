/**
 * Test script for flat address field structure in property forms
 * 
 * This script tests the interaction between:
 * 1. PropertyListForm (renamed address field + horizontal layout)
 * 2. EditPropertyForm (renamed address field + horizontal layout)
 * 3. The propertyController-flat-address adapter
 * 
 * Run this script with: node test-edit-property-flat-address.js
 */

const { spawn } = require('child_process');
const fetch = require('node-fetch');
const readline = require('readline');

// Configuration
const SERVER_PORT = 3000;
const APP_URL = `http://localhost:${SERVER_PORT}`;
const TEST_PROPERTY = {
  title: 'Test Flat Address Property',
  property_type: 'House',
  property_for: 'For Sale',
  total_price: '5000000',
  street: '123 Test Street', // Using flat address structure
  city: 'Addis Ababa',
  regional_state: 'Addis Ababa City Administration',
  country: 'Ethiopia',
  number_of_bedrooms: '3',
  number_of_bathrooms: '2', 
  property_size: '250',
  description: 'Test property with flat address structure'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for user input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

// Start the application
async function startApp() {
  console.log('Starting the application...');
  
  const app = spawn('node', ['app-launcher.js'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });
  
  // Log server output
  app.stdout.on('data', (data) => {
    console.log(`App: ${data}`);
  });
  
  app.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
  
  // Wait for server to start
  console.log('Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return app;
}

// Test property creation with flat address
async function testPropertyCreation() {
  console.log('\n--- Testing Property Creation with Flat Address ---');
  console.log('Creating a test property with the flat address structure...');
  
  try {
    // Get auth token (simulated here - in a real test, you'd log in)
    const token = 'test-token';
    
    // Create property using the API
    const response = await fetch(`${APP_URL}/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(TEST_PROPERTY)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Property created successfully!');
      console.log('Property ID:', result.data.id || result.data._id);
      return result.data;
    } else {
      console.error('❌ Failed to create property:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating property:', error.message);
    return null;
  }
}

// Test property editing with flat address
async function testPropertyEditing(propertyId) {
  console.log('\n--- Testing Property Editing with Flat Address ---');
  console.log(`Editing property with ID: ${propertyId}`);
  
  try {
    // Get auth token (simulated here - in a real test, you'd log in)
    const token = 'test-token';
    
    // Update the street field
    const updatedData = {
      street: '456 Updated Street Name', // Using flat address structure
      city: 'Addis Ababa',
      regional_state: 'Addis Ababa City Administration'
    };
    
    // Update property using the API
    const response = await fetch(`${APP_URL}/api/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Property updated successfully!');
      return result.data;
    } else {
      console.error('❌ Failed to update property:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error updating property:', error.message);
    return null;
  }
}

// Test property retrieval with flat address
async function testPropertyRetrieval(propertyId) {
  console.log('\n--- Testing Property Retrieval with Flat Address ---');
  console.log(`Retrieving property with ID: ${propertyId}`);
  
  try {
    // Get auth token (simulated here - in a real test, you'd log in)
    const token = 'test-token';
    
    // Get property using the API
    const response = await fetch(`${APP_URL}/api/properties/${propertyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Property retrieved successfully!');
      
      // Check if we get flat address structure back
      const property = result.data;
      console.log('Property Address Structure:');
      console.log('- street:', property.street);
      console.log('- city:', property.city);
      console.log('- regional_state:', property.regional_state);
      console.log('- country:', property.country);
      
      // Verify the adapter worked correctly
      if (property.street && !property.address) {
        console.log('✅ Property has flat address structure!');
      } else if (property.address) {
        console.log('❌ Property still has nested address structure.');
      } else {
        console.log('❓ Property has neither flat nor nested address structure.');
      }
      
      return property;
    } else {
      console.error('❌ Failed to retrieve property:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error retrieving property:', error.message);
    return null;
  }
}

// Main test function
async function runTest() {
  console.log('=== FLAT ADDRESS STRUCTURE TEST ===');
  
  // Start the application
  const app = await startApp();
  
  try {
    // Wait for user to confirm application is running
    await prompt('\nPress Enter when the application is ready to test...');
    
    // Test property creation with flat address
    const createdProperty = await testPropertyCreation();
    
    if (createdProperty) {
      const propertyId = createdProperty.id || createdProperty._id;
      
      // Test property editing with flat address
      await testPropertyEditing(propertyId);
      
      // Test property retrieval with flat address
      await testPropertyRetrieval(propertyId);
    }
    
    console.log('\nTests completed!');
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    // Clean up
    rl.close();
    if (app) {
      process.kill(-app.pid, 'SIGINT');
    }
  }
}

// Run the test
runTest();
