@echo off
echo =======================================================
echo STARTING APP WITH FIXED PROPERTY PROMOTION COMPONENT
echo =======================================================
echo This batch file starts the application with the fixed
echo ChoosePropmotionFixed component to ensure properties 
echo can be properly submitted and saved to the database.
echo.
echo Fixed issues:
echo - Property submission no longer gets stuck on Choose Promotion page
echo - Property data is correctly saved to the database
echo - Proper address field handling prevents 500 errors
echo =======================================================
echo.

echo Starting application...
echo.

node app-launcher.js

echo.
echo Application started successfully!
echo =======================================================
echo.
