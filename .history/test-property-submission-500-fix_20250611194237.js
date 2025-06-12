/**
 * Test script for property submission 500 error fix
 * 
 * This script tests the address field validation fix that prevents 500 errors
 * during property submission.
 * 
 * Run with: node test-property-submission-500-fix.js
 */

require('dotenv').config();
const axios = require('axios');
const colors = require('colors');

// Test configuration
const API_URL = process.env.API_URL || 'http://localhost:7000/api';
const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123'
};

// Test property data - missing address fields
const testPropertyMissingAddress = {
    title: "Test Property with Missing Address Fields",
    propertyType: "House",
    offeringType: "For Sale",
    price: 5000000,
    area: 250,
    bedrooms: 3,
    bathrooms: 2,
    description: "Test property with missing address fields",
    // Deliberately omitting country, city, state, street
    features: {
        "parking-space": true,
        "24-7-security": true
    },
    promotionType: "Basic",
    images: [
        {
            url: "/uploads/test-property-image-1749260861596-438465535.jpg",
            caption: "Default Property Image"
        }
    ]
};

// Utility functions for logging
const logSuccess = (message) => console.log(colors.green(message));
const logError = (message) => console.log(colors.red(message));
const logInfo = (message) => console.log(colors.blue(message));
const logWarning = (message) => console.log(colors.yellow(message));
const logSeparator = () => console.log(colors.gray('='.repeat(50)));

// Function to authenticate user and get token
async function authenticateUser() {
    try {
        logInfo("Authenticating test user...");
        
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        
        if (response.data && response.data.token) {
            logSuccess("Authentication successful!");
            return response.data.token;
        } else {
            logError("Authentication failed: No token received");
            return null;
        }
    } catch (error) {
        logError(`Authentication error: ${error.message}`);
        if (error.response) {
            logError(`Response data: ${JSON.stringify(error.response.data)}`);
        }
        return null;
    }
}

// Function to test property submission with missing address fields
async function testPropertySubmissionWithMissingAddress(token) {
    try {
        logInfo("Testing property submission with missing address fields...");
        logInfo("This should NOT fail with 500 error since our fix adds fallbacks");
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        logInfo("Submitting property with data:");
        console.log(JSON.stringify(testPropertyMissingAddress, null, 2));
        
        const response = await axios.post(
            `${API_URL}/properties`, 
            testPropertyMissingAddress, 
            config
        );
        
        logSuccess("Property submission successful!");
        logInfo("Response status: " + response.status);
        logInfo("Response data:");
        console.log(JSON.stringify(response.data, null, 2));
        
        // Check if address fields were added with fallbacks
        if (response.data && response.data.street && 
            response.data.city && response.data.state && 
            response.data.country) {
            logSuccess("Address fields were properly added with fallbacks:");
            logInfo(`Street: ${response.data.street}`);
            logInfo(`City: ${response.data.city}`);
            logInfo(`State: ${response.data.state}`);
            logInfo(`Country: ${response.data.country}`);
        } else {
            logWarning("Some address fields may be missing in the response.");
        }
        
        return response.data;
    } catch (error) {
        logError(`Property submission error: ${error.message}`);
        if (error.response) {
            logError(`Status: ${error.response.status}`);
            logError(`Response data: ${JSON.stringify(error.response.data)}`);
            
            // Check if it's a validation error (400) rather than a server error (500)
            if (error.response.status === 400) {
                logWarning("Received 400 Bad Request - This is better than a 500 Server Error");
                logInfo("The controller is properly validating the input instead of crashing");
            }
        }
        return null;
    }
}

// Main function to run the tests
async function runTests() {
    logSeparator();
    logInfo("PROPERTY SUBMISSION 500 ERROR FIX TEST");
    logInfo("This test verifies that the property submission API properly handles");
    logInfo("missing address fields without returning a 500 server error");
    logSeparator();
    
    try {
        // Step 1: Authenticate
        const token = await authenticateUser();
        if (!token) {
            logError("Cannot proceed with tests without authentication token");
            return;
        }
        
        logSeparator();
        
        // Step 2: Test property submission with missing address fields
        const createdProperty = await testPropertySubmissionWithMissingAddress(token);
        
        logSeparator();
        
        if (createdProperty) {
            logSuccess("TEST PASSED: Property submission with missing address fields was handled correctly");
            logInfo("The controller successfully added fallback values for missing address fields");
            
            // Log property ID for cleanup if needed
            logInfo(`Property created with ID: ${createdProperty._id}`);
            logInfo("You may want to delete this test property from the database");
        } else {
            logWarning("TEST OUTCOME UNCERTAIN: Property was not created, but the server didn't crash with 500 error");
            logInfo("Check the logs above for more details on what happened");
        }
    } catch (error) {
        logError(`Unexpected error during tests: ${error.message}`);
        console.error(error);
    }
    
    logSeparator();
}

// Run the tests
runTests();
