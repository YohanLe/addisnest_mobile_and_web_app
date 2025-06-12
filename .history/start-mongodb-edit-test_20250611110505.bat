@echo off
echo ====================================================
echo MongoDB ID Property Edit Feature Starter
echo ====================================================
echo This script starts all necessary components for testing MongoDB ID property editing

echo.
echo 1. Starting the Node.js backend server with MongoDB support...
start cmd /k "cd src && node server.js"

echo.
echo 2. Starting the frontend development server...
start cmd /k "cd src && npm run dev"

echo.
echo 3. Preparing test environment...
node test-mongodb-id-property-edit.js

echo.
echo All components have been started!
echo * Backend API is running on http://localhost:5000
echo * Frontend is running on http://localhost:5173
echo * Test data has been prepared in localStorage
echo.
echo To test the MongoDB ID property edit functionality:
echo 1. Open browser and navigate to: http://localhost:5173/property-edit/6849bd6a2b9f36399990f4fb
echo 2. The form should be populated with the test property data
echo.
echo Press any key to close this window...
pause
