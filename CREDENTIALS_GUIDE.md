# Environment Variables Guide for Netlify

This guide explains exactly which environment variables to set in Netlify and where to get the values.

## Overview

You can configure **3-5 environment variables** in Netlify for this application to work:

| Variable | Purpose | Required |
|----------|---------|----------|
| `GOOGLE_MAPS_API_KEY` | Display interactive map | Yes |
| `GOOGLE_SHEETS_ID` | Identify which spreadsheet to read | Yes |
| `GOOGLE_SHEETS_API_KEY` | Access Google Sheets (simpler method) | One of these |
| `GOOGLE_SHEETS_CREDENTIALS` | Access Google Sheets (more secure) | One of these |
| `GOOGLE_SHEETS_RANGE` | Specify data range in sheet | Optional |

**Note:** You need either `GOOGLE_SHEETS_API_KEY` **OR** `GOOGLE_SHEETS_CREDENTIALS`, not both.

## How to Set Environment Variables in Netlify

1. Log in to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** (or **Site configuration**)
4. Click **Environment variables** in the left sidebar
5. Click **Add a variable** or **Add environment variables**
6. For each variable:
   - Enter the **Key** (variable name)
   - Enter the **Value** (see sections below)
   - Select scopes: **All scopes** and **All deploy contexts**
   - Click **Create variable**

## Variable Details

### 1. GOOGLE_MAPS_API_KEY

**What it is:** Your Google Maps API key for displaying the interactive map.

**Where to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → API Key**
5. Copy the generated API key

**What to enter in Netlify:**
```
Key: GOOGLE_MAPS_API_KEY
Value: AIzaSyC1234567890abcdefghijklmnopqrstuv
```

**Example value format:**
```
AIzaSyCZ6IuZRP8qMiPhVnE3iCkYhNdIrY0-mA0
```

**Important:** 
- After creating, restrict this API key:
  - **API restrictions**: Only allow "Maps JavaScript API"
  - **Application restrictions**: Set HTTP referrers to your Netlify domain

---

## Google Sheets Authentication

You have **two options** for authenticating with Google Sheets. Choose the one that works best for you:

### Option A: API Key (Simpler - Recommended if you're okay with a public sheet)

**Pros:**
- ✅ Much simpler to set up (just one API key)
- ✅ No service account or JSON file needed
- ✅ Perfect if your location data is not sensitive

**Cons:**
- ⚠️ Your Google Sheet must be publicly accessible ("Anyone with the link can view")

---

### 2. GOOGLE_SHEETS_API_KEY (Option A - Simpler)

**What it is:** An API key for accessing Google Sheets API.

**Where to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Click **Create Credentials → API Key**
4. Copy the generated API key

**What to enter in Netlify:**
```
Key: GOOGLE_SHEETS_API_KEY
Value: AIzaSyD1234567890abcdefghijklmnopqrstuv
```

**Example value format:**
```
AIzaSyDaBcDeFg123456789AbCdEfGhIjKlMnO
```

**Important steps:**
1. **Enable Google Sheets API:**
   - In Google Cloud Console, go to **APIs & Services → Library**
   - Search for "Google Sheets API"
   - Click "Enable"

2. **Make your Google Sheet public:**
   - Open your Google Sheet
   - Click the "Share" button
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

3. **Optional - Restrict the API key:**
   - In Google Cloud Console, click on the API key
   - Under **API restrictions**: Select "Restrict key" and check "Google Sheets API"
   - Under **Application restrictions**: Add your Netlify domain
   - Click "Save"

---

### Option B: Service Account (More Secure - Recommended for private sheets)

**Pros:**
- ✅ Your Google Sheet can remain private
- ✅ More secure - only the service account has access
- ✅ Works with Google Drive too

**Cons:**
- ⚠️ More complex setup (need to create service account and download JSON)
- ⚠️ Need to share the sheet with the service account email

---

### 3. GOOGLE_SHEETS_CREDENTIALS (Option B - More Secure)

**What it is:** The complete service account credentials JSON file for accessing Google Sheets.

**Where to get it:**
1. In [Google Cloud Console](https://console.cloud.google.com/), go to **APIs & Services → Credentials**
2. Click **Create Credentials → Service Account**
3. Create the service account with **Viewer** role
4. Click on the service account name
5. Go to **Keys** tab
6. Click **Add Key → Create new key**
7. Select **JSON** format
8. Click **Create** - a file will download

**What to enter in Netlify:**

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...",
  "client_email": "service-account-name@project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Copy the ENTIRE content** (all the text from `{` to `}`) and paste it into Netlify:

```
Key: GOOGLE_SHEETS_CREDENTIALS
Value: {"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important notes:**
- Copy the entire JSON, including the curly braces `{` and `}`
- It should be on a single line (Netlify handles this automatically)
- Do NOT modify the JSON content
- Keep the `\n` characters in the private_key as-is
- Remember the `client_email` - you'll need it to share your Google Sheet

**Important steps after creating:**
1. **Enable Google Sheets API:**
   - In Google Cloud Console, go to **APIs & Services → Library**
   - Search for "Google Sheets API"
   - Click "Enable"

2. **Share your Google Sheet with the service account:**
   - Open your Google Sheet
   - Click "Share" button
   - Add the `client_email` from the JSON file (e.g., `your-service@project.iam.gserviceaccount.com`)
   - Set permission to "Viewer"
   - **Uncheck** "Notify people"
   - Click "Share"

**Example of what to copy:**
The entire file content, which starts with `{` and ends with `}`, including all the fields shown above.

---

### 4. GOOGLE_SHEETS_ID

**What it is:** The unique identifier of your Google Sheets spreadsheet.

**Where to get it:**

Look at your Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/edit
```

The Spreadsheet ID is the long string between `/d/` and `/edit`:
```
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

**What to enter in Netlify:**
```
Key: GOOGLE_SHEETS_ID
Value: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

**Example URL breakdown:**
```
https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
                                         ^^^^^^^^^^^^^^^^
```

---

### 5. GOOGLE_SHEETS_RANGE (Optional - Not Required!)

**What it is:** Specifies which sheet and optionally which columns to read from your spreadsheet.

**Is it required?** **NO!** The sheet range is completely optional. If you don't specify it, the function will:
- Default to reading from "Sheet1"
- Automatically detect all columns based on header names in the first row

**Default value:** If not set, defaults to `Sheet1` (reads all data from the first sheet)

**When to use it:**
- If your data is on a differently named sheet (e.g., "Locations" instead of "Sheet1")
- If you want to limit which columns are read (though this is rarely necessary)

**How it works:**

The function automatically detects columns based on header names in your first row:
- Headers containing "address" or "location" → Address column
- Headers containing "lat" or "latitude" → Latitude column  
- Headers containing "long", "lng", or "longitude" → Longitude column
- Headers containing "visit" or "visited" → Visited status column

**This means you can:**
- Put columns in any order
- Name headers anything (as long as they contain the keywords above)
- Add extra columns - they'll be ignored
- Not specify a range at all!

**Common examples:**

If your sheet tab is named "Sheet1" (default):
```
Leave GOOGLE_SHEETS_RANGE empty or unset - it will work automatically!
```

If your sheet tab is named "Locations":
```
Key: GOOGLE_SHEETS_RANGE
Value: Locations
```

If your sheet tab is named "Sheet1" and you want only columns A through D:
```
Key: GOOGLE_SHEETS_RANGE
Value: Sheet1!A:D
```

If your sheet tab is named "Locations" and you want specific rows:
```
Key: GOOGLE_SHEETS_RANGE
Value: Locations!A1:D100
```

**What to enter in Netlify (if needed):**
```
Key: GOOGLE_SHEETS_RANGE
Value: Sheet1
```
(or adjust based on your sheet name)

**Format options:**
```
SheetName              - Reads all data from named sheet
SheetName!A:D          - Reads columns A through D from named sheet
SheetName!A1:D100      - Reads specific cell range from named sheet
Sheet1                 - Reads all data from Sheet1 (default)
```

**Example: Your spreadsheet has these headers:**
```
| Location | Lat | Long | Status | Notes | Priority |
```

The function will automatically find:
- "Location" → Address
- "Lat" → Latitude
- "Long" → Longitude
- "Status" → Visited (if it contains "Yes" or "No")
- "Notes" and "Priority" columns are ignored

You don't need to specify the range at all!

---

## Complete Example

Here's what the environment variables look like in Netlify:

**Example using API Key (simpler):**
```
GOOGLE_MAPS_API_KEY
AIzaSyCZ6IuZRP8qMiPhVnE3iCkYhNdIrY0-mA0

GOOGLE_SHEETS_API_KEY
AIzaSyDaBcDeFg123456789AbCdEfGhIjKlMnO

GOOGLE_SHEETS_ID
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t

GOOGLE_SHEETS_RANGE (optional - leave empty to use Sheet1 with auto-detect)
Sheet1
```

**Example using Service Account (more secure):**
```
GOOGLE_MAPS_API_KEY
AIzaSyCZ6IuZRP8qMiPhVnE3iCkYhNdIrY0-mA0

GOOGLE_SHEETS_CREDENTIALS
{"type":"service_account","project_id":"site-map-12345","private_key_id":"abc123def456","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCB...","client_email":"site-map-reader@site-map-12345.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/site-map-reader%40site-map-12345.iam.gserviceaccount.com"}

GOOGLE_SHEETS_ID
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t

GOOGLE_SHEETS_RANGE (optional - leave empty to use Sheet1 with auto-detect)
Locations
```

## Verification Checklist

After setting environment variables:

**Minimum required:**
- [ ] GOOGLE_MAPS_API_KEY is set
- [ ] GOOGLE_SHEETS_ID is set
- [ ] Either GOOGLE_SHEETS_API_KEY **OR** GOOGLE_SHEETS_CREDENTIALS is set
- [ ] No typos in variable names (they are case-sensitive)
- [ ] Triggered a new deployment after adding variables

**If using API Key method:**
- [ ] Google Sheets API is enabled in Google Cloud Console
- [ ] Your Google Sheet is publicly accessible (Anyone with link can view)

**If using Service Account method:**
- [ ] Google Sheets API is enabled in Google Cloud Console
- [ ] JSON credentials are complete (starts with `{`, ends with `}`)
- [ ] Google Sheet is shared with the service account email

**Optional:**
- [ ] GOOGLE_SHEETS_RANGE is set if your sheet is not named "Sheet1"

## Connecting to Google Drive

The same `GOOGLE_SHEETS_CREDENTIALS` can be used to access Google Drive:

1. Enable **Google Drive API** in Google Cloud Console
2. Share your Drive files/folders with the service account email (from the credentials JSON)
3. The service account can now access those files

You would then create additional Netlify Functions that use the same credentials to interact with Google Drive.

## Security Notes

🔒 **Never commit these values to Git**
- The `.gitignore` file prevents `.env` files from being committed
- Always use Netlify's environment variables for secrets

🔒 **Service Account Security**
- The service account only has "Viewer" role (read-only)
- Only shares the minimum necessary files with it
- Never share the credentials JSON file publicly

🔒 **API Key Security (Google Sheets)**
- If using API key method, your sheet must be publicly accessible
- Consider service account method for private sheets
- Restrict the Sheets API key to your domain if possible

## Troubleshooting

**"Failed to fetch API key" error:**
- Check that `GOOGLE_MAPS_API_KEY` is set in Netlify
- Verify there are no extra spaces before/after the key
- Redeploy the site after adding the variable

**"Failed to fetch data from Google Sheets" error:**

*If using API Key:*
- Verify `GOOGLE_SHEETS_API_KEY` is set in Netlify
- Check that Google Sheets API is enabled in Google Cloud Console
- Confirm your Google Sheet is publicly accessible (Share > Anyone with link can view)
- Verify `GOOGLE_SHEETS_ID` matches your spreadsheet

*If using Service Account:*
- Verify `GOOGLE_SHEETS_CREDENTIALS` contains the complete JSON
- Check that the service account email has access to your sheet
- Confirm `GOOGLE_SHEETS_ID` matches your spreadsheet
- Ensure Google Sheets API is enabled in Google Cloud Console

**"Missing authentication" error:**
- You need to set either `GOOGLE_SHEETS_API_KEY` or `GOOGLE_SHEETS_CREDENTIALS`
- Choose one method and set that variable

**No data showing / Column detection issues:**
- Check that your first row contains headers
- Headers should include keywords: "address", "lat", "long", "visit"
- If no headers, ensure data is in order: Address, Latitude, Longitude, Visited
- Try setting `GOOGLE_SHEETS_RANGE` to your specific sheet name

**JSON formatting issues (Service Account only):**
- Copy the entire JSON file content as-is
- Don't add or remove quotes
- Keep `\n` characters in the private_key
- The JSON should be on a single line (Netlify handles this)

**Sheet not shared error (Service Account only):**
- Open your Google Sheet
- Click Share button
- Add the `client_email` from your credentials JSON
- Give it "Viewer" permission
- Uncheck "Notify people"

**Sheet not public error (API Key only):**
- Open your Google Sheet
- Click Share button
- Click "Change to anyone with the link"
- Set permission to "Viewer"
- Click "Done"

## Need Help?

If you're still having issues:
1. Check the Netlify Function logs for specific error messages
2. Verify all variables are spelled correctly (case-sensitive)
3. Ensure Google Cloud APIs (Maps JavaScript API and Sheets API) are enabled
4. Confirm billing is enabled on your Google Cloud project (free tier is fine)
5. Try the API key method first - it's simpler to set up

Remember: After adding or changing environment variables, you must trigger a new deployment for the changes to take effect!
