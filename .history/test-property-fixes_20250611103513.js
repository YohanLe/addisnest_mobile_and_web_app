/**
 * Test script for Property Image and Listing Display Fixes
 * This script:
 * 1. Resets test data in localStorage
 * 2. Launches the application to test the fixes
 */

const { exec } = require('child_process');
const fs = require('fs');

console.log('\n===========================================');
console.log('  🏠 Property Image & Listing Display Fix Tester  🏠');
console.log('===========================================\n');

// Create a simple HTML page that will clear localStorage and redirect to the application
const createResetPage = () => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reset Test Data</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
          text-align: center;
        }
        .container {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 600px;
        }
        h2 {
          color: #4a6cf7;
          margin-top: 0;
        }
        .progress {
          margin: 20px 0;
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          width: 0%;
          background-color: #4a6cf7;
          animation: progress 3s ease-in-out forwards;
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .buttons {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary {
          background-color: #4a6cf7;
          color: white;
        }
        .btn-success {
          background-color: #28a745;
          color: white;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        .fix-details {
          text-align: left;
          margin-top: 20px;
          padding: 15px;
          background-color: #f0f7ff;
          border-radius: 4px;
          font-size: 14px;
          border-left: 4px solid #4a6cf7;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Property Fixes Test Page</h2>
        <p>This page helps test the fixes for property image display and new listing visibility.</p>
        
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        
        <div class="fix-details">
          <h3>Fixes Implemented:</h3>
          <ol>
            <li><strong>Image Path Fix:</strong> Ensures property images display correctly by fixing path formatting</li>
            <li><strong>New Property Display Fix:</strong> Makes newly submitted properties appear immediately in listings</li>
          </ol>
        </div>
        
        <div class="buttons">
          <button class="btn btn-primary" onclick="resetAndRedirect()">Reset & Test Fixes</button>
          <a href="property-image-display-test.html" class="btn btn-success">Test With Sample Data</a>
          <button class="btn btn-secondary" onclick="clearData()">Clear All Test Data</button>
        </div>
      </div>

      <script>
        function resetAndRedirect() {
          // Mock user authentication
          localStorage.setItem('access_token', 'test-token-for-fix-test');
          localStorage.setItem('user', JSON.stringify({
            _id: "test-user-123",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            role: "user"
          }));
          
          // Redirect to app
          window.location.href = 'http://localhost:5173/property-list-form';
        }
        
        function clearData() {
          // Clear property-related data
          const keys = [
            'propertyListings',
            'property_listings',
            'test_property',
            'user_property_listings',
            'addinest_properties',
            'property_edit_data'
          ];
          
          keys.forEach(key => localStorage.removeItem(key));
          
          alert('All test property data has been cleared from localStorage');
        }
      </script>
    </body>
    </html>
  `;

  fs.writeFileSync('test-property-fixes.html', html);
  console.log('Created test page: test-property-fixes.html');
}

// Create the reset page
createResetPage();

// Launch the application if it's not already running
console.log('Checking if application is already running...');
exec('node fixed-launcher.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting application: ${error.message}`);
    return;
  }
  
  console.log(stdout);
  
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
});

// Open the test page
console.log('\nTest Instructions:');
console.log('1. Open the test page in your browser: test-property-fixes.html');
console.log('2. Click "Reset & Test Fixes" to go to the property form');
console.log('3. Submit a new property with images');
console.log('4. Verify that the property appears in the account management listings with images');
console.log('\nAlternatively, click "Test With Sample Data" to use pre-configured test data');
