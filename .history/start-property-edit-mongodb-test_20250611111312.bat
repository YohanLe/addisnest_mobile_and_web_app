@echo off
echo Running MongoDB ID property edit test...

:: First run the setup script to create test data
node test-mongodb-id-property-edit.js

:: Then start the server and frontend
echo Starting the backend server...
start cmd /k "node src/server.js"

echo Starting the frontend...
cd src && start cmd /k "npm run dev"

:: Instructions for testing
echo.
echo MongoDB ID Property Edit Test is set up!
echo.
echo To test the fix:
echo 1. Wait for the frontend to start
echo 2. Navigate to: http://localhost:5173/property-edit/6849bd6a2b9f36399990f4fb
echo 3. The form should be populated with the test property data
echo.
echo Press any key to exit...
pause > nul
