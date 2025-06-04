#!/bin/bash

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI is not installed. Installing now..."
    npm install -g netlify-cli
fi

# Check if user is logged in
if ! netlify status | grep -q "Logged in"; then
    echo "You need to log in to Netlify first."
    netlify login
fi

# List sites and extract IDs
echo "Fetching your Netlify sites..."
netlify sites:list

echo ""
echo "-------------------------------------------------------------"
echo "Copy the Site ID from the list above."
echo "You'll need to add this as the NETLIFY_SITE_ID secret in GitHub."
echo "-------------------------------------------------------------"
echo ""
echo "To create a new personal access token, visit:"
echo "https://app.netlify.com/user/applications#personal-access-tokens"
echo ""
echo "Add both the Site ID and the personal access token as secrets in your GitHub repository:"
echo "1. Go to your GitHub repo"
echo "2. Click Settings > Secrets and variables > Actions"
echo "3. Add two new repository secrets:"
echo "   - NETLIFY_SITE_ID (the Site ID from above)"
echo "   - NETLIFY_AUTH_TOKEN (your personal access token)"
