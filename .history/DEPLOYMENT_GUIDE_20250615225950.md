# Deployment Guide for addisnest-test.com

This guide walks you through deploying the Addinest Real Estate Platform to Netlify and connecting your custom domain.

## Prerequisites

- Node.js and npm installed
- Netlify CLI installed (`npm install -g netlify-cli`)
- A Netlify account (create one at [netlify.com](https://www.netlify.com) if you don't have one)
- Ownership of the domain addisnest-test.com

## Step 1: Build the Project

The project has already been built, and the output is in the `dist` directory. If you need to rebuild, run:

```bash
npm run build
```

## Step 2: Deploy to Netlify

### Automatic Deployment (Recommended)

Run the deployment script:

```bash
# On Windows
deploy-to-netlify.bat

# On Unix/Linux/Mac
./deploy-to-netlify.sh
```

### Manual Deployment

If you prefer to deploy manually, follow these steps:

1. **Login to Netlify:**
   ```bash
   netlify login
   ```

2. **Initialize the project:**
   ```bash
   netlify init
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Set a custom site name or leave blank for an auto-generated name

3. **Deploy the site:**
   ```bash
   netlify deploy --prod
   ```
   - When prompted for the publish directory, enter `dist`

## Step 3: Connect Your Custom Domain

1. Log into the Netlify dashboard at [app.netlify.com](https://app.netlify.com)
2. Select your newly deployed site
3. Go to Site settings > Domain management > Domains > Add custom domain
4. Enter `addisnest-test.com` and follow the instructions to configure your DNS

### DNS Configuration

You'll need to configure your domain registrar to point to Netlify's servers. There are two options:

#### Option 1: Using Netlify DNS (Recommended)

1. In your Netlify site dashboard, go to Domain settings
2. Select "Set up Netlify DNS" and follow the instructions
3. Update your domain's nameservers at your registrar to the ones provided by Netlify

#### Option 2: Using External DNS

If you prefer to keep your current DNS provider:

1. Add a CNAME record for `www.addisnest-test.com` pointing to your Netlify site URL (`yoursite.netlify.app`)
2. For the apex domain (addisnest-test.com), add:
   - An A record pointing to Netlify's load balancer IP: `75.2.60.5`
   - Or, if your DNS provider supports it, an ALIAS/ANAME record pointing to your Netlify site URL

## Step 4: Enable HTTPS

Netlify automatically provisions SSL certificates through Let's Encrypt once your custom domain is connected. Ensure HTTPS is enabled in your site settings.

## Step 5: Verify Deployment

Visit your custom domain (addisnest-test.com) to verify that:
- The site loads correctly
- All pages and links work
- API connections function properly
- Assets (images, CSS, JavaScript) load without errors

## Troubleshooting

- **Page Not Found Errors**: The `_redirects` file and `netlify.toml` configuration are already set up to handle client-side routing. If issues persist, verify these files are included in your build.
- **API Connection Issues**: Ensure the `.env.production` file has the correct API endpoint.
- **Failed Builds**: Check the build logs in Netlify for error messages.

## Continuous Deployment

For future updates:

1. Set up GitHub integration in Netlify for automatic deployments on push
2. Configure build settings and environment variables in the Netlify dashboard
