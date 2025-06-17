#!/bin/bash

# Build the project (if not already built)
if [ ! -d "./dist" ]; then
  echo "Building the project..."
  npm run build
fi

# Check if the build was successful
if [ ! -d "./dist" ]; then
  echo "Build failed! Check the error messages above."
  exit 1
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "Deployment complete!"
echo "Next steps to connect your custom domain (addisnest-test.com):"
echo "1. Log into the Netlify dashboard (https://app.netlify.com)"
echo "2. Select your newly deployed site"
echo "3. Go to Site settings > Domain management > Domains > Add custom domain"
echo "4. Enter 'addisnest-test.com' and follow the instructions to configure your DNS"
