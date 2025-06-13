@echo off
echo.
echo Starting application with Property Detail Address Fix applied...
echo ===============================================================
echo.
echo 1. This fix resolves the issue where address data is not matching with property ID 6849e2ef7cb3172bbb3c718d
echo 2. The application will start with the fix applied
echo 3. You can test the specific property with ID: 6849e2ef7cb3172bbb3c718d
echo.
echo Starting server...

cd %~dp0
node restart-app.js

echo.
echo Server is now running with the address fix applied.
echo To verify the fix is working correctly, you can run: run-property-detail-address-fix-test.bat
echo.
echo Press any key to exit this window...
pause > nul
