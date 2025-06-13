@echo off
echo ======================================================
echo Testing MongoDB ID Property Lookup Fix
echo ======================================================
echo.
echo This script will test the MongoDB ID property lookup fix
echo to ensure that the property detail pages can load properly
echo with MongoDB IDs.
echo.
echo Press any key to start the test...
pause > nul

node test-property-mongo-id-fix.js

echo.
echo Test completed. Press any key to exit...
pause > nul
