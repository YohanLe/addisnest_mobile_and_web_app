@echo off
echo ===== Deploying to Netlify =====

REM Check if dist directory exists
if not exist ".\dist" (
    echo Building the project...
    call npm run build
)

REM Check if build was successful
if not exist ".\dist" (
    echo Build failed! Check the error messages above.
    exit /b 1
)

REM Deploy to Netlify
echo Deploying to Netlify...
call netlify deploy --prod

echo Deployment complete!
echo ===== Next steps to connect your custom domain (addisnest-test.com) =====
echo 1. Log into the Netlify dashboard (https://app.netlify.com)
echo 2. Select your newly deployed site
echo 3. Go to Site settings ^> Domain management ^> Domains ^> Add custom domain
echo 4. Enter 'addisnest-test.com' and follow the instructions to configure your DNS
