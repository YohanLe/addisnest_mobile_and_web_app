@echo off
echo Starting MongoDB Property Schema Update Test
echo ===========================================

echo Starting server...
start cmd /k "node src/server.js"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Running property schema update test...
node test-property-submission-final.js

echo Test completed!
echo Press any key to exit...
pause > nul
