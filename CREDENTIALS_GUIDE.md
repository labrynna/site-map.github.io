# Environment Variables Guide for Netlify

This guide explains exactly which environment variables to set in Netlify and where to get the values.

## Overview

You need to configure **4 environment variables** in Netlify for this application to work:

| Variable | Purpose | Required |
|----------|---------|----------|
| `GOOGLE_MAPS_API_KEY` | Display interactive map | Yes |
| `GOOGLE_SHEETS_CREDENTIALS` | Access Google Sheets data | Yes |
| `GOOGLE_SHEETS_ID` | Identify which spreadsheet to read | Yes |
| `GOOGLE_SHEETS_RANGE` | Specify data range in sheet | Optional |

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

### 2. GOOGLE_SHEETS_CREDENTIALS

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

**Example of what to copy:**
The entire file content, which starts with `{` and ends with `}`, including all the fields shown above.

---

### 3. GOOGLE_SHEETS_ID

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

### 4. GOOGLE_SHEETS_RANGE (Optional)

**What it is:** Specifies which sheet and cell range to read from your spreadsheet.

**Default value:** If not set, defaults to `Sheet1!A:D`

**Where to get it:**

This depends on your spreadsheet structure:
- Sheet name: The name of the tab in your spreadsheet
- Range: The cell range to read (e.g., A:D for columns A through D)

**Common examples:**

If your sheet tab is named "Sheet1":
```
Key: GOOGLE_SHEETS_RANGE
Value: Sheet1!A:D
```

If your sheet tab is named "Locations":
```
Key: GOOGLE_SHEETS_RANGE
Value: Locations!A:D
```

If you have headers in row 1 and data starts in row 2:
```
Key: GOOGLE_SHEETS_RANGE
Value: Sheet1!A2:D
```

If you want to read columns A through E (including a 5th column):
```
Key: GOOGLE_SHEETS_RANGE
Value: Sheet1!A:E
```

**Format:**
```
SheetName!StartCell:EndCell
```

**What to enter in Netlify:**
```
Key: GOOGLE_SHEETS_RANGE
Value: Sheet1!A:D
```
(or adjust based on your sheet name and structure)

---

## Complete Example

Here's what all four environment variables look like in Netlify:

```
GOOGLE_MAPS_API_KEY
AIzaSyCZ6IuZRP8qMiPhVnE3iCkYhNdIrY0-mA0

GOOGLE_SHEETS_CREDENTIALS
{"type":"service_account","project_id":"site-map-12345","private_key_id":"abc123def456","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCB...","client_email":"site-map-reader@site-map-12345.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/site-map-reader%40site-map-12345.iam.gserviceaccount.com"}

GOOGLE_SHEETS_ID
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t

GOOGLE_SHEETS_RANGE
Sheet1!A:D
```

## Verification Checklist

After setting all environment variables:

- [ ] All 4 variables are listed in Netlify environment variables
- [ ] No typos in variable names (they are case-sensitive)
- [ ] JSON credentials are complete (starts with `{`, ends with `}`)
- [ ] Spreadsheet ID matches your Google Sheets URL
- [ ] Sheet range matches your actual sheet name
- [ ] Google Sheets is shared with the service account email
- [ ] Triggered a new deployment after adding variables

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

🔒 **API Key Security**
- Restrict the Maps API key to your domain
- Restrict to only the Maps JavaScript API
- Set up usage quotas and billing alerts

## Troubleshooting

**"Failed to fetch API key" error:**
- Check that `GOOGLE_MAPS_API_KEY` is set in Netlify
- Verify there are no extra spaces before/after the key
- Redeploy the site after adding the variable

**"Failed to fetch data from Google Sheets" error:**
- Verify `GOOGLE_SHEETS_CREDENTIALS` contains the complete JSON
- Check that the service account email has access to your sheet
- Confirm `GOOGLE_SHEETS_ID` matches your spreadsheet
- Ensure `GOOGLE_SHEETS_RANGE` matches your sheet name

**JSON formatting issues:**
- Copy the entire JSON file content as-is
- Don't add or remove quotes
- Keep `\n` characters in the private_key
- The JSON should be on a single line (Netlify handles this)

**Sheet not shared error:**
- Open your Google Sheet
- Click Share button
- Add the `client_email` from your credentials JSON
- Give it "Viewer" permission
- Uncheck "Notify people"

## Need Help?

If you're still having issues:
1. Check the Netlify Function logs for specific error messages
2. Verify all variables are spelled correctly (case-sensitive)
3. Ensure Google Cloud APIs (Maps JavaScript API and Sheets API) are enabled
4. Confirm billing is enabled on your Google Cloud project (free tier is fine)

Remember: After adding or changing environment variables, you must trigger a new deployment for the changes to take effect!
