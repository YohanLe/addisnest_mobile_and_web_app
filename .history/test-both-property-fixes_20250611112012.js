/**
 * Test Script for Property Editing and Submission Fixes
 * 
 * This script tests both:
 * 1. MongoDB ID property edit functionality
 * 2. Property submission from choose-promotion page
 */

const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration
const DB_CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'addinest';
const PROPERTY_COLLECTION = 'properties';

async function main() {
  console.log('🔍 Starting comprehensive property functionality test...');

  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB...');
    const client = new MongoClient(DB_CONNECTION_STRING);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');

    const db = client.db(DB_NAME);
    const propertiesCollection = db.collection(PROPERTY_COLLECTION);

    // 1. TEST: MongoDB ID Property Edit
    console.log('\n🧪 Testing MongoDB ID Property Edit functionality...');

    // Create a test property with MongoDB ID
    const testMongoProperty = {
      _id: new ObjectId('6849bd6a2b9f36399990f4fb'), // Use a consistent ID for testing
      propertyType: 'House',
      offeringType: 'For Sale',
      price: 25000000,
      bedrooms: 4,
      bathrooms: 3,
      address: {
        street: '123 MongoDB Street',
        city: 'Addis Ababa',
        state: 'Addis Ababa City Administration',
        country: 'Ethiopia'
      },
      description: 'Test property for MongoDB ID edit functionality',
      status: 'active',
      createdAt: new Date()
    };

    // Check if test property already exists, delete if it does
    const existingProperty = await propertiesCollection.findOne({ _id: testMongoProperty._id });
    if (existingProperty) {
      console.log('🔄 Test property already exists, deleting it...');
      await propertiesCollection.deleteOne({ _id: testMongoProperty._id });
    }

    // Insert the test property
    console.log('📝 Creating test property with MongoDB ID format...');
    await propertiesCollection.insertOne(testMongoProperty);
    console.log(`✅ Test property created with ID: ${testMongoProperty._id}`);

    // 2. TEST: Property Submission
    console.log('\n🧪 Testing Property Submission functionality...');
    
    // Create a test submission property for choose-promotion page
    const testSubmissionProperty = {
      propertyType: 'Apartment',
      offeringType: 'For Rent',
      price: 15000,
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      address: {
        street: '456 Submission Test Street',
        city: 'Addis Ababa',
        state: 'Addis Ababa City Administration',
        country: 'Ethiopia'
      },
      description: 'Test property for submission functionality',
      images: [
        { url: '/uploads/test-property-image-1749260861596-438465535.jpg', caption: 'Test Image 1' }
      ],
      features: { parking_space: true, air_conditioning: true, security_24_7: true },
      furnishingStatus: 'Furnished',
      promotionType: 'Basic'
    };

    // Store test data in localStorage emulation file
    const localStorageData = {
      property_edit_data: JSON.stringify(testMongoProperty),
      [`property_edit_data_${testMongoProperty._id}`]: JSON.stringify(testMongoProperty),
      promotion_test_property: JSON.stringify(testSubmissionProperty)
    };

    // Write to a file that will be loaded by the test HTML page
    fs.writeFileSync(
      path.join(__dirname, 'test-property-data.js'),
      `// Test data for property functionality
window.testPropertyData = ${JSON.stringify(localStorageData, null, 2)};

// Load this data into localStorage
Object.keys(window.testPropertyData).forEach(key => {
  localStorage.setItem(key, window.testPropertyData[key]);
});

console.log('✅ Test property data loaded into localStorage');`
    );

    console.log('✅ Test data prepared and saved to test-property-data.js');

    // Create a simple HTML file to load and test
    const testHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Functionality Test</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; }
    h2 { color: #3498db; margin-top: 30px; }
    .test-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .btn { display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px; margin-bottom: 10px; }
    .btn:hover { background: #2980b9; }
    .code { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
    pre { margin: 0; }
  </style>
</head>
<body>
  <h1>Property Functionality Test</h1>
  
  <div class="test-card">
    <h2>1. MongoDB ID Property Edit Test</h2>
    <p>This test verifies that property editing works with MongoDB ID format.</p>
    <a href="http://localhost:5173/property-edit/6849bd6a2b9f36399990f4fb" class="btn" target="_blank">Test MongoDB ID Edit</a>
    <div class="code">
      <pre>Property ID: 6849bd6a2b9f36399990f4fb</pre>
    </div>
  </div>

  <div class="test-card">
    <h2>2. Property Submission Test</h2>
    <p>This test verifies that property submission from the choose-promotion page works.</p>
    <a href="http://localhost:5173/property-list-form" class="btn" target="_blank">Go to Property Form</a>
    <a href="http://localhost:5173/choose-promotion" class="btn" target="_blank">Go to Choose Promotion</a>
    <p>Steps:</p>
    <ol>
      <li>Fill out the property form and submit</li>
      <li>Choose a promotion plan (Basic for free listing)</li>
      <li>Confirm the property is saved correctly</li>
    </ol>
  </div>

  <div class="test-card">
    <h2>How to Run This Test</h2>
    <p>1. Make sure the application is running:</p>
    <div class="code">
      <pre>1. Start MongoDB server
2. Start backend: node src/server.js
3. Start frontend: cd src && npm run dev</pre>
    </div>
    <p>2. Click the test buttons above to verify each feature</p>
  </div>

  <script src="test-property-data.js"></script>
</body>
</html>
    `;

    fs.writeFileSync(path.join(__dirname, 'test-property-fixes.html'), testHtmlContent);
    console.log('✅ Test HTML page created: test-property-fixes.html');

    // Create a batch file to run the tests
    const batchFileContent = `@echo off
echo Running comprehensive property functionality tests...

:: Create test data
node test-both-property-fixes.js

:: Start the backend server
start cmd /k "node src/server.js"

:: Start the frontend
cd src && start cmd /k "npm run dev"

:: Open the test page
timeout /t 5 /nobreak
start test-property-fixes.html

echo Test environment is set up! Follow the instructions on the test page.
echo Press any key to exit...
pause > nul
`;

    fs.writeFileSync(path.join(__dirname, 'run-property-fixes-test.bat'), batchFileContent);
    console.log('✅ Test batch file created: run-property-fixes-test.bat');

    console.log('\n✅ All test setup complete! Run run-property-fixes-test.bat to start testing.');
    
    // Close MongoDB connection
    await client.close();
    console.log('✅ MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
