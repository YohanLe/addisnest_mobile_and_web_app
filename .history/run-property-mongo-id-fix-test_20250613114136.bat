@echo off
echo Running MongoDB ID Property Lookup Fix Test
echo ================================================
echo This test verifies the fix for property lookup using MongoDB Object IDs
echo.

node test-property-mongo-id-fix.js

echo.
echo Test completed. Check the output above for results.
echo Press any key to exit...
pause > nul
