# Continuous Integration/Continuous Deployment (CI/CD) Setup

This project uses GitHub Actions to automatically build and deploy to Netlify whenever changes are pushed to the main branch.

## Setting Up Secrets

To make the CI/CD workflow work, you need to add the following secrets to your GitHub repository:

1. **NETLIFY_AUTH_TOKEN**: Your Netlify personal access token
2. **NETLIFY_SITE_ID**: The API ID of your Netlify site

### How to get your Netlify Auth Token:

1. Log in to your Netlify account
2. Go to User Settings (click on your avatar in the top right corner)
3. Select "Applications"
4. Under "Personal access tokens", click "New access token"
5. Give it a name like "GitHub Actions" and click "Generate token"
6. Copy the generated token (you will only see it once!)

### How to get your Netlify Site ID:

1. Log in to your Netlify account
2. Go to your site's settings
3. Scroll down to "Site information"
4. Copy the "API ID" value

### Adding Secrets to GitHub:

1. Go to your GitHub repository
2. Click on "Settings"
3. Click on "Secrets and variables" in the left sidebar
4. Click on "Actions"
5. Click on "New repository secret"
6. Add both `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` with their respective values

## How it works

The CI/CD pipeline will:
1. Checkout your code
2. Set up Node.js
3. Install dependencies
4. Build the project
5. Deploy to Netlify

After setting up the secrets, the pipeline will automatically run whenever you push to the main branch.

## Manual Deployment

If you need to deploy manually, you can still use the Netlify CLI:

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod
```
