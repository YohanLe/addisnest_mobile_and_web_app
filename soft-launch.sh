#!/bin/bash

echo "==================================================="
echo "        Addisnest.com Soft Launch Assistant"
echo "==================================================="
echo ""
echo "This script will help you execute your soft launch plan."
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "Netlify CLI not found. Installing..."
  npm install -g netlify-cli
  if [ $? -ne 0 ]; then
    echo "Failed to install Netlify CLI. Please install it manually with:"
    echo "npm install -g netlify-cli"
    exit 1
  fi
fi

function show_menu {
  echo ""
  echo "Please select an option:"
  echo ""
  echo "1. Deploy to staging (draft URL)"
  echo "2. Deploy to production"
  echo "3. Check site status"
  echo "4. Open soft launch guides"
  echo "5. Exit"
  echo ""
  read -p "Enter your choice (1-5): " choice
  
  case $choice in
    1) deploy_staging ;;
    2) deploy_production ;;
    3) check_status ;;
    4) open_guides ;;
    5) exit_script ;;
    *) echo "Invalid choice. Please try again."; show_menu ;;
  esac
}

function deploy_staging {
  echo ""
  echo "==================================================="
  echo "              Deploying to staging"
  echo "==================================================="
  echo ""
  echo "This will create a draft deployment with a unique URL for testing."
  echo "When prompted, select \"dist\" as the publish directory."
  echo ""
  read -p "Press Enter to continue..."
  netlify deploy
  echo ""
  echo "Staging deployment complete. The draft URL is listed above."
  echo "Please test thoroughly using the SOFT_LAUNCH_CHECKLIST.md before proceeding to production."
  echo ""
  read -p "Press Enter to continue..."
  show_menu
}

function deploy_production {
  echo ""
  echo "==================================================="
  echo "             Deploying to production"
  echo "==================================================="
  echo ""
  echo "WARNING: This will deploy your site to production at your Netlify URL."
  echo "Are you sure you want to proceed?"
  echo ""
  read -p "Type 'yes' to continue: " confirm
  if [ "$confirm" != "yes" ]; then
    show_menu
    return
  fi

  echo ""
  echo "Deploying to production..."
  echo "When prompted, select \"dist\" as the publish directory."
  echo ""
  netlify deploy --prod
  echo ""
  echo "Production deployment complete."
  echo ""
  echo "Next steps:"
  echo "1. Set up password protection or beta subdomain in Netlify dashboard"
  echo "2. Configure your custom domain settings"
  echo "3. Begin inviting your initial test users"
  echo ""
  read -p "Press Enter to continue..."
  show_menu
}

function check_status {
  echo ""
  echo "==================================================="
  echo "               Checking site status"
  echo "==================================================="
  echo ""
  netlify status
  echo ""
  read -p "Press Enter to continue..."
  show_menu
}

function open_guides {
  echo ""
  echo "==================================================="
  echo "                 Opening guides"
  echo "==================================================="
  echo ""
  
  # Detect operating system and use appropriate command to open files
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open SOFT_LAUNCH_GUIDE.md
    open SOFT_LAUNCH_CHECKLIST.md
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
      xdg-open SOFT_LAUNCH_GUIDE.md
      xdg-open SOFT_LAUNCH_CHECKLIST.md
    else
      echo "Cannot open files automatically. Please open these files manually:"
      echo "- SOFT_LAUNCH_GUIDE.md"
      echo "- SOFT_LAUNCH_CHECKLIST.md"
    fi
  else
    # Fallback for other systems
    echo "Cannot open files automatically. Please open these files manually:"
    echo "- SOFT_LAUNCH_GUIDE.md"
    echo "- SOFT_LAUNCH_CHECKLIST.md"
  fi
  
  show_menu
}

function exit_script {
  echo ""
  echo "Thank you for using the Addisnest Soft Launch Assistant."
  echo ""
  exit 0
}

# Start with the main menu
show_menu
