@echo off
echo ======================================================
echo Starting AddiNest with MongoDB ID Lookup Fix
echo ======================================================
echo.
echo This script starts the application with the MongoDB ID property
echo lookup fix enabled, which allows the property detail page to
echo load properties using MongoDB ObjectIDs.
echo.
echo Press any key to start the server...
pause > nul

:: Set environment variables
set PORT=7000
set NODE_ENV=development

:: Start the server with the MongoDB ID lookup fix
node src/server.js

echo.
echo Server stopped. Press any key to exit...
pause > nul
