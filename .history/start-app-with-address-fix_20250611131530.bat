@echo off
echo Starting application with address structure fix...
echo.
echo This script will launch the application with all the address structure fixes applied.
echo.
echo Changes implemented:
echo 1. Created propertyController-nested.js for middleware handling
echo 2. Updated propertyRoutes.js to use the nested address controller
echo 3. Modified PropertyListForm.jsx to send nested address structure
echo 4. Modified EditPropertyForm.jsx to handle nested address structure
echo.
echo Press any key to launch the application...
pause > nul

cd %~dp0
echo Starting the server...
start cmd /k "npm run server"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Starting the frontend...
start cmd /k "npm run dev"

echo Application launched successfully!
echo.
echo To test the address structure fix:
echo 1. Create a new property using the property listing form
echo 2. Edit an existing property and verify address fields save correctly
echo 3. Run test-address-structure-fix.bat to validate API interactions
echo.
echo Press any key to exit...
pause > nul
