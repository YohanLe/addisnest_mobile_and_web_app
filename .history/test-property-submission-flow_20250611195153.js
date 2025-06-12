/**
 * Test script for property submission flow with fixed ChoosePropmotionFixed component
 * 
 * This script tests the complete flow from property creation to saving in the database
 * using the fixed ChoosePropmotionFixed component.
 * 
 * Run with: node test-property-submission-flow.js
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

// Complete test property data with all required fields
const testProperty = {
    title: "Test Property for Submission Flow",
    propertyType: "House",
    offeringType: "For Sale",
    price: 5000000,
    area: 250,
    bedrooms: 3,
    bathrooms: 2,
    description: "Test property for submission flow verification",
    street: "123 Test Street",
    city: "Test City",
    state: "Test State",
    country: "Ethiopia",
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

// Function to submit property
async function submitProperty(token) {
    try {
        logInfo("Testing complete property submission flow...");
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        logInfo("Submitting property with complete data:");
        console.log(JSON.stringify(testProperty, null, 2));
        
        const response = await axios.post(
            `${API_URL}/properties`, 
            testProperty, 
            config
        );
        
        logSuccess("Property submission successful!");
        logInfo("Response status: " + response.status);
        logInfo("Response data:");
        console.log(JSON.stringify(response.data, null, 2));
        
        // Verify that the property was saved correctly
        if (response.data && response.data._id) {
            logSuccess(`Property saved successfully with ID: ${response.data._id}`);
            
            // Verify all fields were saved correctly
            const savedProperty = response.data;
            const fieldVerifications = [
                { field: 'title', expected: testProperty.title, actual: savedProperty.title },
                { field: 'propertyType', expected: testProperty.propertyType, actual: savedProperty.propertyType },
                { field: 'offeringType', expected: testProperty.offeringType, actual: savedProperty.offeringType },
                { field: 'price', expected: testProperty.price, actual: savedProperty.price },
                { field: 'area', expected: testProperty.area, actual: savedProperty.area },
                { field: 'bedrooms', expected: testProperty.bedrooms, actual: savedProperty.bedrooms },
                { field: 'bathrooms', expected: testProperty.bathrooms, actual: savedProperty.bathrooms },
                { field: 'street', expected: testProperty.street, actual: savedProperty.street },
                { field: 'city', expected: testProperty.city, actual: savedProperty.city },
                { field: 'state', expected: testProperty.state, actual: savedProperty.state },
                { field: 'country', expected: testProperty.country, actual: savedProperty.country },
                { field: 'promotionType', expected: testProperty.promotionType, actual: savedProperty.promotionType }
            ];
            
            logInfo("Verifying saved property fields:");
            let allFieldsCorrect = true;
            
            fieldVerifications.forEach(verification => {
                if (verification.expected === verification.actual) {
                    console.log(colors.green(`✓ ${verification.field}: ${verification.actual}`));
                } else {
                    console.log(colors.red(`✗ ${verification.field}: Expected ${verification.expected}, got ${verification.actual}`));
                    allFieldsCorrect = false;
                }
            });
            
            if (allFieldsCorrect) {
                logSuccess("All property fields were saved correctly!");
            } else {
                logWarning("Some property fields were not saved correctly. Check the verification above.");
            }
            
            return savedProperty;
        } else {
            logWarning("Property submission response doesn't contain an _id. The property might not have been saved correctly.");
            return response.data;
        }
    } catch (error) {
        logError(`Property submission error: ${error.message}`);
        if (error.response) {
            logError(`Status: ${error.response.status}`);
            logError(`Response data: ${JSON.stringify(error.response.data)}`);
        }
        return null;
    }
}

// Function to verify property was saved by retrieving it
async function verifyPropertyExists(token, propertyId) {
    try {
        logInfo(`Verifying property exists in database with ID: ${propertyId}...`);
        
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        
        const response = await axios.get(`${API_URL}/properties/${propertyId}`, config);
        
        if (response.data && response.data._id === propertyId) {
            logSuccess("Property verification successful - property exists in database!");
            return true;
        } else {
            logError("Property verification failed - could not retrieve property");
            return false;
        }
    } catch (error) {
        logError(`Property verification error: ${error.message}`);
        if (error.response) {
            logError(`Status: ${error.response.status}`);
            logError(`Response data: ${JSON.stringify(error.response.data)}`);
        }
        return false;
    }
}

// Main function to run the tests
async function runTests() {
    logSeparator();
    logInfo("PROPERTY SUBMISSION FLOW TEST");
    logInfo("This test verifies the complete property submission flow");
    logInfo("using the fixed ChoosePropmotionFixed component");
    logSeparator();
    
    try {
        // Step 1: Authenticate
        const token = await authenticateUser();
        if (!token) {
            logError("Cannot proceed with tests without authentication token");
            return;
        }
        
        logSeparator();
        
        // Step 2: Submit property
        const savedProperty = await submitProperty(token);
        if (!savedProperty || !savedProperty._id) {
            logError("Property submission failed. Cannot proceed with verification.");
            return;
        }
        
        logSeparator();
        
        // Step 3: Verify property exists in database
        const propertyExists = await verifyPropertyExists(token, savedProperty._id);
        
        logSeparator();
        
        // Final test result
        if (propertyExists) {
            logSuccess("TEST PASSED: Property submission flow is working correctly!");
            logInfo("The property was successfully created and saved to the database.");
            logInfo(`Property created with ID: ${savedProperty._id}`);
            logInfo("You may want to delete this test property from the database.");
        } else {
            logError("TEST FAILED: Property submission flow is not working correctly!");
            logInfo("The property could not be verified in the database after submission.");
        }
    } catch (error) {
        logError(`Unexpected error during tests: ${error.message}`);
        console.error(error);
    }
    
    logSeparator();
}

// Run the tests
runTests();
