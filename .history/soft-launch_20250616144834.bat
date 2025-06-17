@echo off
echo ===================================================
echo        Addisnest.com Soft Launch Assistant
echo ===================================================
echo.
echo This script will help you execute your soft launch plan.
echo.

REM Check if netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Netlify CLI not found. Installing...
  npm install -g netlify-cli
  if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Netlify CLI. Please install it manually with:
    echo npm install -g netlify-cli
    goto end
  )
)

:menu
echo.
echo Please select an option:
echo.
echo 1. Deploy to staging (draft URL)
echo 2. Deploy to production
echo 3. Check site status
echo 4. Open soft launch guides
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto staging
if "%choice%"=="2" goto production
if "%choice%"=="3" goto status
if "%choice%"=="4" goto guides
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
goto menu

:staging
echo.
echo ===================================================
echo              Deploying to staging
echo ===================================================
echo.
echo This will create a draft deployment with a unique URL for testing.
echo When prompted, select "dist" as the publish directory.
echo.
pause
netlify deploy
echo.
echo Staging deployment complete. The draft URL is listed above.
echo Please test thoroughly using the SOFT_LAUNCH_CHECKLIST.md before proceeding to production.
echo.
pause
goto menu

:production
echo.
echo ===================================================
echo             Deploying to production
echo ===================================================
echo.
echo WARNING: This will deploy your site to production at your Netlify URL.
echo Are you sure you want to proceed? 
echo.
set /p confirm="Type 'yes' to continue: "
if not "%confirm%"=="yes" goto menu

echo.
echo Deploying to production...
echo When prompted, select "dist" as the publish directory.
echo.
netlify deploy --prod
echo.
echo Production deployment complete.
echo.
echo Next steps:
echo 1. Set up password protection or beta subdomain in Netlify dashboard
echo 2. Configure your custom domain settings
echo 3. Begin inviting your initial test users
echo.
pause
goto menu

:status
echo.
echo ===================================================
echo               Checking site status
echo ===================================================
echo.
netlify status
echo.
pause
goto menu

:guides
echo.
echo ===================================================
echo                 Opening guides
echo ===================================================
echo.
start SOFT_LAUNCH_GUIDE.md
start SOFT_LAUNCH_CHECKLIST.md
goto menu

:end
echo.
echo Thank you for using the Addisnest Soft Launch Assistant.
echo.
