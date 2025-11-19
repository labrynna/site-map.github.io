# 📝 Deployment Checklist

Use this checklist to ensure you complete all steps for deploying to Netlify with secure environment variables.

## Pre-Deployment Setup

### ☐ Google Cloud Project Setup

- [ ] **Create or select a Google Cloud project**
  - Go to: https://console.cloud.google.com/
  - Click "Select a project" → "New Project"
  - Name: "Site Map" (or your preferred name)
  - Note the project ID: ___________________________

- [ ] **Enable billing (required for APIs)**
  - Go to: Billing section in Google Cloud Console
  - Enable billing (Google provides $200 free credit/month)
  - Set up billing alerts (recommended)

### ☐ Google Maps API Setup

- [ ] **Enable Maps JavaScript API**
  - Go to: APIs & Services → Library
  - Search: "Maps JavaScript API"
  - Click "Enable"

- [ ] **Create API Key**
  - Go to: APIs & Services → Credentials
  - Click "Create Credentials" → "API Key"
  - Copy and save the key: ___________________________

- [ ] **Restrict API Key (Important!)**
  - Click "Edit API key" (or click on the key name)
  - Under "API restrictions":
    - Select "Restrict key"
    - Check only "Maps JavaScript API"
  - Under "Application restrictions":
    - Select "HTTP referrers (web sites)"
    - Add: `https://*.netlify.app/*`
    - Add: `http://localhost:*` (for testing)
    - Later, add your custom domain if applicable
  - Click "Save"

### ☐ Google Sheets API Setup

- [ ] **Enable Google Sheets API**
  - Go to: APIs & Services → Library
  - Search: "Google Sheets API"
  - Click "Enable"

- [ ] **Create Service Account**
  - Go to: APIs & Services → Credentials
  - Click "Create Credentials" → "Service Account"
  - Name: "site-map-reader" (or your preferred name)
  - Description: "Service account for reading location data"
  - Click "Create and Continue"

- [ ] **Assign Role**
  - Role: Select "Basic" → "Viewer"
  - Click "Continue"
  - Skip optional fields
  - Click "Done"

- [ ] **Create Service Account Key**
  - Find your service account in the list
  - Click on it to open details
  - Go to "Keys" tab
  - Click "Add Key" → "Create new key"
  - Select "JSON" format
  - Click "Create"
  - **Save the downloaded file securely!**
  - File saved to: ___________________________

- [ ] **Note Service Account Email**
  - Open the JSON file
  - Find `"client_email"` field
  - Copy the email: ___________________________
  - You'll need this to share your Google Sheet

### ☐ Google Sheets Preparation

- [ ] **Create or open your spreadsheet**
  - Go to: https://sheets.google.com/
  - Create new or open existing sheet
  - Sheet name: ___________________________

- [ ] **Format your data correctly**
  - Column A: Address (full address as text)
  - Column B: Latitude (decimal number, e.g., -33.8568)
  - Column C: Longitude (decimal number, e.g., 151.2153)
  - Column D: Visited ("Yes" or "No" - case sensitive)
  - Optional: Add header row in first row

- [ ] **Share sheet with service account**
  - Click "Share" button (top-right)
  - Paste service account email: ___________________________
  - Permission: "Viewer"
  - **Uncheck** "Notify people"
  - Click "Share" or "Send"

- [ ] **Copy Spreadsheet ID**
  - Look at the URL of your spreadsheet
  - Copy the ID (between `/d/` and `/edit`)
  - Spreadsheet ID: ___________________________

- [ ] **Note your sheet name and range**
  - Sheet name (tab name): ___________________________
  - Range: ___________________________
  - Example: "Sheet1!A:D" or "Locations!A:D"

## Netlify Setup

### ☐ Deploy to Netlify

- [ ] **Sign up/Login to Netlify**
  - Go to: https://app.netlify.com/
  - Sign up or log in (can use GitHub account)

- [ ] **Import repository**
  - Click "Add new site"
  - Select "Import an existing project"
  - Choose your Git provider (GitHub, GitLab, Bitbucket)
  - Authorize Netlify to access your repositories
  - Select: `site-map.github.io` repository

- [ ] **Configure build settings**
  - Branch to deploy: `main` (or your default branch)
  - Build command: (leave empty)
  - Publish directory: `.` (just a dot)
  - Click "Deploy site"

- [ ] **Wait for initial deployment**
  - Watch the deploy log
  - Wait for "Site is live" message
  - Note your site URL: ___________________________

### ☐ Configure Environment Variables

- [ ] **Navigate to environment variables**
  - In Netlify Dashboard, go to your site
  - Click "Site settings" (or "Site configuration")
  - In left sidebar, click "Environment variables"

- [ ] **Add GOOGLE_MAPS_API_KEY**
  - Click "Add a variable" or "Add environment variables"
  - Key: `GOOGLE_MAPS_API_KEY` (case-sensitive!)
  - Value: [Paste your Google Maps API key]
  - Scopes: All scopes
  - Deploy contexts: All deploy contexts
  - Click "Create variable"

- [ ] **Add GOOGLE_SHEETS_CREDENTIALS**
  - Click "Add a variable"
  - Key: `GOOGLE_SHEETS_CREDENTIALS` (case-sensitive!)
  - Value: [Open the service account JSON file and copy ENTIRE content]
  - Important: Copy from `{` to `}` including all content
  - Scopes: All scopes
  - Deploy contexts: All deploy contexts
  - Click "Create variable"

- [ ] **Add GOOGLE_SHEETS_ID**
  - Click "Add a variable"
  - Key: `GOOGLE_SHEETS_ID` (case-sensitive!)
  - Value: [Paste your spreadsheet ID]
  - Scopes: All scopes
  - Deploy contexts: All deploy contexts
  - Click "Create variable"

- [ ] **Add GOOGLE_SHEETS_RANGE**
  - Click "Add a variable"
  - Key: `GOOGLE_SHEETS_RANGE` (case-sensitive!)
  - Value: `Sheet1!A:D` (or your sheet name + range)
  - Scopes: All scopes
  - Deploy contexts: All deploy contexts
  - Click "Create variable"

- [ ] **Verify all 4 variables are set**
  - Check that all variables appear in the list
  - No typos in variable names
  - No extra spaces in values

### ☐ Redeploy with Environment Variables

- [ ] **Trigger new deployment**
  - Go to "Deploys" tab
  - Click "Trigger deploy"
  - Select "Clear cache and deploy site"
  - Wait for deployment to complete

## Testing & Verification

### ☐ Test Your Site

- [ ] **Visit your site**
  - Click on the site URL in Netlify
  - Or go to: ___________________________

- [ ] **Check map loads**
  - Map should display (might take a few seconds)
  - No error messages visible
  - Map is interactive (can zoom, pan)

- [ ] **Check location markers**
  - Markers appear on the map
  - Green markers for visited locations
  - Red markers for not-visited locations
  - Correct number of markers

- [ ] **Test location list**
  - Location cards appear in sidebar
  - Addresses match your Google Sheet
  - Visit status is correct (✓ Visited or ○ Not Visited)

- [ ] **Test filters**
  - Click "All" - shows all locations
  - Click "Not Visited" - shows only red markers
  - Click "Visited" - shows only green markers
  - Markers on map update accordingly

- [ ] **Test "Center" button**
  - Click "Center" on a location card
  - Map zooms to that location
  - Info window appears on marker

- [ ] **Test "Open in Google Maps"**
  - Click "Open in Google Maps" button
  - Opens in new tab
  - Shows correct location

- [ ] **Test "Update Map" button**
  - Click "Update Map" button
  - Button shows "Updating..."
  - Then shows "Update successful! Refreshing..."
  - Page refreshes after 2 seconds
  - Data loads correctly

### ☐ Check for Errors

- [ ] **Check browser console**
  - Press F12 to open Developer Tools
  - Go to "Console" tab
  - Should see no red error messages
  - Green messages like "Loaded fresh data from Google Sheets" are good

- [ ] **Check Netlify Function logs**
  - In Netlify Dashboard, go to "Functions" tab
  - Should see: `get-maps-key` and `update-map`
  - Click on each to view recent executions
  - Check for any error messages

- [ ] **Test data update**
  - Edit a value in your Google Sheet (change "Yes" to "No")
  - Visit your site and click "Update Map"
  - Verify the change appears on the map

## Optional: Custom Domain

### ☐ Add Custom Domain (Optional)

- [ ] **Add domain in Netlify**
  - Go to: Site settings → Domain management
  - Click "Add custom domain"
  - Enter your domain name
  - Follow DNS configuration instructions

- [ ] **Update API key restrictions**
  - Go back to Google Cloud Console
  - Edit your Maps API key restrictions
  - Add your custom domain to HTTP referrers
  - Example: `https://yourdomain.com/*`
  - Save changes

## Troubleshooting

If something doesn't work, check:

- [ ] **All environment variables are set correctly**
  - No typos in variable names (they're case-sensitive)
  - Complete values (especially JSON for credentials)
  - Triggered new deployment after adding variables

- [ ] **Google Sheets is shared correctly**
  - Service account email has access
  - Permission is set to "Viewer"
  - Spreadsheet ID is correct

- [ ] **APIs are enabled**
  - Maps JavaScript API is enabled
  - Google Sheets API is enabled
  - Billing is enabled on Google Cloud project

- [ ] **Function logs show details**
  - Check Netlify Function logs for specific errors
  - Look at browser console for client-side errors

## 📚 Reference Documentation

For detailed help on each step:

- **MIGRATION_SUMMARY.md** - Quick overview
- **NETLIFY_SETUP.md** - Detailed setup guide
- **CREDENTIALS_GUIDE.md** - Variable formatting help
- **README.md** - Complete documentation
- **ARCHITECTURE.md** - Technical details

## ✅ Completion

- [ ] **All checklist items above are complete**
- [ ] **Site is live and working**
- [ ] **Map displays correctly**
- [ ] **Data loads from Google Sheets**
- [ ] **No errors in console or logs**

**Congratulations! Your site is now deployed on Netlify with secure environment variables! 🎉**

---

## Quick Reference

**Netlify Environment Variables (4 required):**
1. `GOOGLE_MAPS_API_KEY` - Your Maps API key
2. `GOOGLE_SHEETS_CREDENTIALS` - Service account JSON (entire file content)
3. `GOOGLE_SHEETS_ID` - Spreadsheet ID from URL
4. `GOOGLE_SHEETS_RANGE` - Sheet name and range (e.g., Sheet1!A:D)

**Important Links:**
- Netlify: https://app.netlify.com/
- Google Cloud Console: https://console.cloud.google.com/
- Google Sheets: https://sheets.google.com/

**Need Help?**
- Check troubleshooting sections in the documentation files
- Review Netlify Function logs for errors
- Check browser console (F12) for client-side errors
