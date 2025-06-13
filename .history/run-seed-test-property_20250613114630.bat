@echo off
echo Seeding test properties with specific MongoDB IDs for property lookup testing...
echo ================================================
echo This will create test properties with IDs:
echo - 684a5fb17cb3172bbb3c75d7 (from logs)
echo - 684a57857cb3172bbb3c73d9 (from browser)
echo.

node seed-test-property-data.js

echo.
echo Seeding completed. Check the output above for results.
echo Press any key to exit...
pause > nul
