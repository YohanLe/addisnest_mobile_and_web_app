@echo off
echo ===========================================================
echo     AddinEst Application Startup Script
echo ===========================================================
echo.
echo Starting the application with proper port configuration...
echo.

:: Run the fixed launcher script
node fixed-launcher.js

echo.
echo If the application doesn't start properly, try:
echo 1. Run 'taskkill /im node.exe /f' to kill any conflicting processes
echo 2. Then run this script again
echo.
echo ===========================================================
