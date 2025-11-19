# Site Visit Map

A web application for displaying and managing site visit locations on Google Maps with secure credential management via Netlify.

## Features

- Display multiple locations on an interactive Google Map
- Color-coded markers:
  - **Green** for visited locations (Picture taken = "Yes")
  - **Red** for not visited locations (Picture taken = "No")
  - **Yellow** for unknown status (Picture taken is empty or other value)
- Filter locations by visit status (All, Not Visited, Visited)
  - Yellow markers (unknown status) only appear when "All" filter is selected
- **Hide/Show Map toggle** - Hide the map to view only the address list centered on the page
- Click markers to see location details
- Center map on specific locations
- Open locations directly in Google Maps app
- Automatic data synchronization from Google Sheets
- **n8n workflow integration** - Optional webhook trigger when updating the map
- Secure API key and credentials management via Netlify environment variables

## Deployment on Netlify

This application is designed to be deployed on **Netlify** with secure environment variable management.

### Prerequisites

1. A [Netlify account](https://www.netlify.com/) (free tier works fine)
2. A Google Cloud project with billing enabled
3. A Google Sheets document with your location data

### Step 1: Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API** for your project
4. Go to **APIs & Services → Credentials**
5. Click **Create Credentials → API Key**
6. Copy the API key (you'll add it to Netlify later)

**Security Best Practices:**
- Restrict the API key to your Netlify domain (e.g., `https://your-site.netlify.app/*`)
- Restrict to only **Maps JavaScript API**
- Set usage quotas to prevent unexpected charges

### Step 2: Set Up Google Sheets API Access

#### Create a Service Account

1. In [Google Cloud Console](https://console.cloud.google.com/), go to **APIs & Services → Credentials**
2. Click **Create Credentials → Service Account**
3. Give it a name (e.g., "site-map-sheets-reader")
4. Click **Create and Continue**
5. Grant the role: **Viewer** (read-only access)
6. Click **Continue**, then **Done**

#### Generate Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key → Create New Key**
4. Choose **JSON** format
5. Click **Create** - this downloads a JSON file
6. **Keep this file secure!** It contains your credentials

#### Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services → Library**
2. Search for "Google Sheets API"
3. Click on it and click **Enable**

### Step 3: Prepare Your Google Sheets

1. Create or open your Google Sheets document
2. Format your data with these columns (in order):
   ```
   Column A: Address (e.g., "123 Main St, City, State, Country")
   Column B: Latitude (e.g., -33.8568)
   Column C: Longitude (e.g., 151.2153)
   Column D: Visited status ("Yes" or "No")
   ```

3. Optional: Add a header row (it will be automatically detected and skipped)

4. **Share the sheet with the service account:**
   - Click the **Share** button in Google Sheets
   - Add the service account email (found in the JSON key file as `client_email`)
   - It looks like: `site-map-sheets-reader@your-project.iam.gserviceaccount.com`
   - Give it **Viewer** access
   - Uncheck "Notify people"
   - Click **Share**

5. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### Step 4: Deploy to Netlify

#### Option A: Deploy via Netlify UI

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **Add new site → Import an existing project**
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select this repository
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (root directory)
6. Click **Deploy site**

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts to create a new site or link to existing
```

### Step 5: Configure Netlify Environment Variables

After deployment, you need to add environment variables:

1. Go to your site in Netlify Dashboard
2. Navigate to **Site settings → Environment variables**
3. Click **Add a variable** and add the following:

#### Required Environment Variables:

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key | From Step 1 (Google Cloud Console) |
| `GOOGLE_SHEETS_CREDENTIALS` | Full JSON content from service account key file | From Step 2 (the downloaded JSON file) |
| `GOOGLE_SHEETS_ID` | Your spreadsheet ID | From Step 3 (from the Google Sheets URL) |
| `GOOGLE_SHEETS_RANGE` | `Sheet1!A:D` (or your range) | Optional - adjust if your sheet has a different name or range |

#### Optional Environment Variables:

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `N8N_WEBHOOK_URL` | Your n8n workflow webhook URL | Optional - If you have an n8n workflow that should be triggered when "Update Map" is clicked |

**Important Notes:**
- For `GOOGLE_SHEETS_CREDENTIALS`: Copy the **entire content** of the JSON file (including the curly braces)
- The JSON should be on a single line (Netlify will handle it correctly)
- Example format: `{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...",...}`
- For `N8N_WEBHOOK_URL`: If provided, this webhook will be called when the "Update Map" button is clicked (in addition to fetching data from Google Sheets)

### Step 6: Verify the Deployment

1. Once environment variables are set, trigger a new deploy:
   - Go to **Deploys** tab
   - Click **Trigger deploy → Clear cache and deploy site**

2. Visit your site URL (e.g., `https://your-site.netlify.app`)

3. The map should load with your locations from Google Sheets

4. Click the **Update Map** button to fetch the latest data from Google Sheets

## Connecting to Google Drive

The same service account credentials used for Google Sheets can access Google Drive if you share the files/folders with the service account:

1. In Google Drive, right-click on the file or folder
2. Click **Share**
3. Add the service account email (from the JSON credentials file)
4. Grant appropriate permissions (Viewer for read-only)
5. Click **Done**

The service account can now access those files via the Google Drive API. You would need to:
1. Enable the **Google Drive API** in Google Cloud Console
2. Create a new Netlify Function that uses the same credentials to access Drive
3. The `GOOGLE_SHEETS_CREDENTIALS` environment variable already contains everything needed

## Local Development

To test locally:

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Add your environment variables to the `.env` file
4. Install dependencies:
   ```bash
   npm install
   ```
5. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
6. Run the development server:
   ```bash
   netlify dev
   ```
7. Open `http://localhost:8888` in your browser

## Environment Variables Summary

Here's a quick reference of all environment variables needed in Netlify:

```
GOOGLE_MAPS_API_KEY=your_maps_api_key
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...complete JSON...}
GOOGLE_SHEETS_ID=your_spreadsheet_id_from_url
GOOGLE_SHEETS_RANGE=Sheet1!A:D
```

## Updating Location Data

The application automatically tries to fetch fresh data from Google Sheets on each page load. You can also manually trigger an update by clicking the **Update Map** button.

When you update your Google Sheets:
1. Edit the data in your spreadsheet
2. Visit your site and click **Update Map**
3. The page will refresh with the new data

## Troubleshooting

### Map not loading?

1. Check Netlify Function logs: **Functions** tab in Netlify Dashboard
2. Verify `GOOGLE_MAPS_API_KEY` is set correctly
3. Ensure Maps JavaScript API is enabled in Google Cloud Console
4. Check browser console for errors (F12)

### Data not updating from Google Sheets?

1. Verify the service account JSON is correctly formatted in `GOOGLE_SHEETS_CREDENTIALS`
2. Confirm the sheet is shared with the service account email
3. Check that `GOOGLE_SHEETS_ID` matches your spreadsheet
4. Verify `GOOGLE_SHEETS_RANGE` matches your data layout
5. Check Netlify Function logs for error messages

### "Failed to fetch API key" error?

1. Ensure all environment variables are set in Netlify
2. Trigger a new deployment after adding environment variables
3. Check the Netlify Function logs for specific errors

## Security Features

✅ **API keys stored securely** in Netlify environment variables (not in code)  
✅ **Service account credentials** never exposed to the browser  
✅ **Serverless functions** act as a secure proxy  
✅ **No secrets in Git** - `.env` files are gitignored  
✅ **Google Sheets access** via service account with minimal permissions  

## File Structure

```
.
├── index.html              # Main application
├── addresses.json          # Fallback static location data
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies for Netlify Functions
├── .env.example           # Template for environment variables
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── netlify/
    └── functions/
        ├── get-maps-key.js   # Returns Google Maps API key securely
        └── update-map.js      # Fetches data from Google Sheets
```

## License

This project is open source and available for personal and commercial use.
   - Set daily quotas in Google Cloud Console
   - Configure alerts for unusual usage patterns
   - Google provides $200 free credit/month, covering ~28,000 map loads

4. **Monitor Usage**
   - Regularly check the Google Cloud Console for usage metrics
   - Enable billing alerts
   - Review the "APIs & Services" dashboard

**Why this is safe enough:**
- With referrer restrictions, even if someone copies your key, it won't work on their website
- The $200 free credit provides a safety buffer
- You'll be alerted before charges occur
- Client-side API keys are the standard approach for Google Maps - millions of websites use this method

**Learn more:** [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

### 2. Configure the Application

1. Open `index.html` in a text editor
2. Find the line: `const API_KEY = "YOUR_API_KEY_HERE";`
3. Replace `"YOUR_API_KEY_HERE"` with your actual Google Maps API key
4. Save the file

### 3. Add Your Locations

Edit the `addresses.json` file to add your own locations:

```json
[
  {
    "address": "Your Location Name, Full Address",
    "latitude": -33.8568,
    "longitude": 151.2153,
    "visited": "Yes"
  }
]
```

Each location requires:
- `address`: The display name and address
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate  
- `visited`: Either "Yes" or "No"

### 4. Deploy

Since this is a static site, you can deploy it to:
- **GitHub Pages** (recommended): Enable GitHub Pages in your repository settings
- Any static hosting service (Netlify, Vercel, etc.)
- Your own web server

## Usage

- **Filter locations**: Use the filter buttons at the top to show all, only visited, or only not-visited locations
- **Center on location**: Click the "Center" button on any location card
- **Open in Google Maps**: Click "Open in Google Maps" to get directions
- **View details**: Click on any map marker to see location information

## File Structure

```
.
├── index.html        # Main application file
├── addresses.json    # Location data
└── README.md        # This file
```

## Troubleshooting

### Map not loading?

If you see an error message instead of the map:

1. **Check your API key**: Make sure you've replaced `YOUR_API_KEY_HERE` with your actual API key
2. **Enable the API**: Verify that the "Maps JavaScript API" is enabled in your Google Cloud Console
3. **Check billing**: Ensure billing is enabled on your Google Cloud project
4. **Check restrictions**: If you've set API key restrictions, make sure your domain is allowed
5. **Check the console**: Open your browser's developer console (F12) for more detailed error messages

### Markers not showing?

- Verify that your `addresses.json` file is properly formatted JSON
- Check that latitude and longitude values are valid numbers
- Ensure the file is being served correctly (check browser network tab)

## License

This project is open source and available for personal and commercial use.
