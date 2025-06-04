# Check if Netlify CLI is installed
if (-Not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "Netlify CLI is not installed. Installing now..."
    npm install -g netlify-cli
}

# Check if user is logged in
$status = netlify status
if (-Not ($status -match "Logged in")) {
    Write-Host "You need to log in to Netlify first."
    netlify login
}

# List sites and extract IDs
Write-Host "Fetching your Netlify sites..."
netlify sites:list

Write-Host ""
Write-Host "-------------------------------------------------------------"
Write-Host "Copy the Site ID from the list above."
Write-Host "You'll need to add this as the NETLIFY_SITE_ID secret in GitHub."
Write-Host "-------------------------------------------------------------"
Write-Host ""
Write-Host "To create a new personal access token, visit:"
Write-Host "https://app.netlify.com/user/applications#personal-access-tokens"
Write-Host ""
Write-Host "Add both the Site ID and the personal access token as secrets in your GitHub repository:"
Write-Host "1. Go to your GitHub repo"
Write-Host "2. Click Settings > Secrets and variables > Actions"
Write-Host "3. Add two new repository secrets:"
Write-Host "   - NETLIFY_SITE_ID (the Site ID from above)"
Write-Host "   - NETLIFY_AUTH_TOKEN (your personal access token)"
