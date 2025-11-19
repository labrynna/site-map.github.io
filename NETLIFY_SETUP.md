# Netlify Setup Guide

This document provides detailed step-by-step instructions for setting up this application on Netlify with secure environment variables.

## Quick Start Checklist

- [ ] Create Google Cloud project
- [ ] Get Google Maps API key
- [ ] Create service account for Google Sheets API
- [ ] Prepare Google Sheets with location data
- [ ] Deploy site to Netlify
- [ ] Configure environment variables in Netlify
- [ ] Test the deployment

## Detailed Instructions

### 1. Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter a project name (e.g., "Site Map")
4. Click **Create**
5. Wait for the project to be created, then select it

### 2. Enable Required APIs

#### Enable Google Maps JavaScript API

1. In the left sidebar, click **APIs & Services → Library**
2. Search for "Maps JavaScript API"
3. Click on it
4. Click **Enable**

#### Enable Google Sheets API

1. Still in **APIs & Services → Library**
2. Search for "Google Sheets API"
3. Click on it
4. Click **Enable**

### 3. Create Google Maps API Key

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key immediately (store it somewhere safe temporarily)
4. Click **Edit API key** to configure restrictions
5. Under **API restrictions**:
   - Select **Restrict key**
   - Check only **Maps JavaScript API**
6. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your Netlify domain: `https://YOUR-SITE-NAME.netlify.app/*`
   - Add wildcard for custom domains if applicable: `https://*.yourdomain.com/*`
   - For local testing, add: `http://localhost:*`
7. Click **Save**

### 4. Create Service Account for Google Sheets

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials** → **Service Account**
3. Enter details:
   - **Service account name**: `site-map-reader` (or any name you prefer)
   - **Service account ID**: (auto-generated)
   - **Description**: "Service account for reading location data from Google Sheets"
4. Click **Create and Continue**
5. For role, select **Basic → Viewer**
6. Click **Continue**
7. Skip optional fields and click **Done**

### 5. Generate Service Account Key

1. In the **Credentials** page, find your service account in the list
2. Click on it to open details
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Select **JSON** format
6. Click **Create**
7. A JSON file will download automatically - **save it securely!**
8. Open the file and note the `client_email` field - you'll need it to share your Google Sheet

### 6. Prepare Your Google Sheets

#### Create the Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet or open an existing one
3. Name it something like "Site Locations"

#### Format Your Data

Structure your data with these columns (Column A through D):

| Address | Latitude | Longitude | Visited |
|---------|----------|-----------|---------|
| 123 Main St, City, State, Country | -33.8568 | 151.2153 | Yes |
| 456 Oak Ave, City, State, Country | -33.8688 | 151.2093 | No |

**Important:**
- First row can be headers (they'll be auto-detected and skipped)
- Address: Full address as text
- Latitude: Decimal number (negative for South)
- Longitude: Decimal number (negative for West)
- Visited: Either "Yes" or "No" (case-sensitive)

#### Share the Sheet with Service Account

1. Click the **Share** button (top-right corner)
2. In the email field, paste the service account email from the JSON file
   - Format: `site-map-reader@your-project-id.iam.gserviceaccount.com`
3. Set permission to **Viewer**
4. **Uncheck** "Notify people" (service accounts don't need notifications)
5. Click **Share** or **Send**

#### Get the Spreadsheet ID

1. Look at your spreadsheet URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/edit
   ```
2. Copy the ID part (between `/d/` and `/edit`):
   ```
   1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
   ```

### 7. Deploy to Netlify

#### Via Netlify Dashboard (Recommended)

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **Add new site**
3. Choose **Import an existing project**
4. Select your Git provider (GitHub, GitLab, Bitbucket)
5. Authorize Netlify to access your repositories
6. Select this repository
7. Configure build settings:
   - **Branch to deploy**: `main` (or your default branch)
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (just a dot)
8. Click **Deploy site**
9. Wait for the initial deployment to complete

#### Via Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to your project directory
cd /path/to/site-map.github.io

# Initialize Netlify
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Enter a site name
# - Build command: (leave empty)
# - Publish directory: .

# The site will be deployed
```

### 8. Configure Environment Variables in Netlify

1. In Netlify Dashboard, go to your site
2. Click **Site settings** (or **Site configuration**)
3. In the left sidebar, click **Environment variables**
4. Click **Add a variable** or **Add environment variables**

#### Add Each Variable:

**Variable 1: GOOGLE_MAPS_API_KEY**
- Key: `GOOGLE_MAPS_API_KEY`
- Value: Paste your Google Maps API key from Step 3
- Scopes: All scopes, All deploy contexts
- Click **Create variable**

**Variable 2: GOOGLE_SHEETS_CREDENTIALS**
- Key: `GOOGLE_SHEETS_CREDENTIALS`
- Value: Open the service account JSON file from Step 5
  - Copy the **entire content** of the file
  - It should start with `{` and end with `}`
  - Should be one line (Netlify will handle it)
  - Example: `{"type":"service_account","project_id":"...","private_key":"...","client_email":"...",...}`
- Scopes: All scopes, All deploy contexts
- Click **Create variable**

**Variable 3: GOOGLE_SHEETS_ID**
- Key: `GOOGLE_SHEETS_ID`
- Value: Paste the spreadsheet ID from Step 6
- Scopes: All scopes, All deploy contexts
- Click **Create variable**

**Variable 4: GOOGLE_SHEETS_RANGE (Optional)**
- Key: `GOOGLE_SHEETS_RANGE`
- Value: `Sheet1!A:D` (or adjust if your sheet has a different name)
- Scopes: All scopes, All deploy contexts
- Click **Create variable**
- If you named your sheet differently (e.g., "Locations"), use `Locations!A:D`

### 9. Redeploy with Environment Variables

After adding environment variables:

1. Go to the **Deploys** tab
2. Click **Trigger deploy**
3. Select **Clear cache and deploy site**
4. Wait for the deployment to complete (usually 30-60 seconds)

### 10. Test Your Deployment

1. Click on the site URL (e.g., `https://your-site-name.netlify.app`)
2. The map should load and display your locations
3. Check that markers appear on the map
4. Try filtering locations (All / Not Visited / Visited)
5. Click the **Update Map** button to fetch fresh data from Google Sheets
6. Verify that data updates correctly

### 11. Custom Domain (Optional)

If you want to use a custom domain:

1. In Netlify, go to **Site settings → Domain management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. After DNS propagates, update your Google Maps API key restrictions to include your custom domain

## Verifying Everything Works

### Check Netlify Function Logs

1. In Netlify Dashboard, go to **Functions** tab
2. You should see two functions:
   - `get-maps-key`
   - `update-map`
3. Click on each to view logs and recent invocations
4. Look for any errors

### Browser Developer Console

1. Open your site
2. Press F12 to open developer tools
3. Go to the **Console** tab
4. Look for any error messages
5. Check the **Network** tab for failed requests

### Common Issues and Solutions

**Map not loading:**
- Verify `GOOGLE_MAPS_API_KEY` is set correctly in Netlify
- Check that Maps JavaScript API is enabled in Google Cloud Console
- Ensure API key restrictions include your Netlify domain

**"Failed to fetch API key" error:**
- Check Netlify environment variables are saved
- Trigger a new deployment after adding variables
- Check Function logs for errors

**No data showing / "No addresses found" error:**
- Verify Google Sheets ID is correct
- Ensure service account credentials JSON is properly formatted
- Confirm the sheet is shared with the service account email
- Check that `GOOGLE_SHEETS_RANGE` matches your sheet name and data range
- Look at Function logs for specific errors

**Update Map button doesn't work:**
- Check browser console for JavaScript errors
- Verify all environment variables are set
- Check Netlify Function logs for the `update-map` function

## Security Checklist

✅ Google Maps API key has HTTP referrer restrictions  
✅ Google Maps API key is restricted to Maps JavaScript API only  
✅ Service account has minimal permissions (Viewer only)  
✅ Service account credentials are stored in Netlify environment variables (not in code)  
✅ `.env` files are in `.gitignore` (secrets never committed to Git)  
✅ Google Sheets is only shared with the service account (not publicly accessible)  

## Maintenance

### Updating Location Data

Simply edit your Google Sheet. The site will fetch fresh data:
- Automatically on each page load
- Manually when clicking the "Update Map" button

### Monitoring Usage

1. Check Google Cloud Console for API usage:
   - Go to **APIs & Services → Dashboard**
   - View quotas and usage statistics
2. Set up billing alerts to avoid unexpected charges
3. Monitor Netlify Function usage in the Netlify Dashboard

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section in the main README
2. Review Netlify Function logs for error messages
3. Check browser console (F12) for client-side errors
4. Verify all environment variables are correctly set
5. Ensure Google Cloud APIs are enabled and have proper permissions

## Summary

Your site is now fully deployed on Netlify with:
- ✅ Secure API key management
- ✅ Google Sheets integration
- ✅ Automatic data synchronization
- ✅ No credentials exposed in code

All sensitive credentials are safely stored in Netlify environment variables and accessed only by serverless functions.
