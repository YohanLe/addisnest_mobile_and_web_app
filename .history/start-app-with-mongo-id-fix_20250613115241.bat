@echo off
echo ===============================================================
echo      MongoDB ID Property Lookup Fix - Test & Launch Script
echo ===============================================================
echo.
echo This script will:
echo  1. Seed test properties with specific MongoDB IDs
echo  2. Start the backend server with MongoDB ID lookup fix
echo  3. Start the frontend application
echo  4. Open the browser to test property detail pages
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

node launch-with-mongo-id-fix.js

echo.
echo If the application did not start properly, please check the console output above.
echo Press Ctrl+C to stop the application when done testing.
