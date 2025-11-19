# Update: API Key Support & Automatic Header Detection

## What Changed

Based on user feedback, I've updated the Google Sheets integration to be more flexible and easier to use.

## New Feature 1: API Key Support

You now have **TWO OPTIONS** for authenticating with Google Sheets:

### Option A: API Key (Simpler) ✅ RECOMMENDED FOR GETTING STARTED

**Pros:**
- Much simpler setup - just one API key
- No JSON files or service accounts needed
- Perfect if your location data is not sensitive

**Cons:**
- Your Google Sheet must be publicly accessible

**Setup:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Enable Google Sheets API
4. Make your Google Sheet public: Share → "Anyone with the link can view"
5. In Netlify, add environment variable:
   - Key: `GOOGLE_SHEETS_API_KEY`
   - Value: Your API key

### Option B: Service Account (More Secure)

**Pros:**
- Sheet can remain private
- More secure access control

**Cons:**
- More complex setup (need to download JSON key file)
- Need to share sheet with service account email

**Setup:**
Same as before - create service account, download JSON, share sheet, add `GOOGLE_SHEETS_CREDENTIALS` to Netlify.

## New Feature 2: Automatic Header Detection

The sheet range (`GOOGLE_SHEETS_RANGE`) is now **completely optional**!

### How It Works

The function automatically detects columns based on header keywords in your first row:

| Header Contains | Detected As |
|----------------|-------------|
| "address" or "location" | Address column |
| "lat" or "latitude" | Latitude column |
| "long", "lng", or "longitude" | Longitude column |
| "visit" or "visited" | Visited status column |

**Example:**
If your spreadsheet has headers like:
```
| Location | Lat | Long | Status | Notes | Priority |
```

The function will automatically:
- Find "Location" → Address
- Find "Lat" → Latitude
- Find "Long" → Longitude
- Find "Status" → Visited
- Ignore "Notes" and "Priority"

### Sheet Range Now Optional

**Before:** You had to specify `GOOGLE_SHEETS_RANGE=Sheet1!A:D`

**Now:** You can:
- Leave it empty (defaults to "Sheet1")
- Set just the sheet name: `GOOGLE_SHEETS_RANGE=Locations`
- Or still use the old format if you want: `GOOGLE_SHEETS_RANGE=Sheet1!A:D`

## What You Need to Set in Netlify

### Minimum Required (3 variables):

1. `GOOGLE_MAPS_API_KEY` - Your Maps API key (same as before)
2. `GOOGLE_SHEETS_ID` - Your spreadsheet ID (same as before)
3. **Choose ONE:**
   - `GOOGLE_SHEETS_API_KEY` - If using API key method (NEW)
   - `GOOGLE_SHEETS_CREDENTIALS` - If using service account method

### Optional:

4. `GOOGLE_SHEETS_RANGE` - Only needed if your sheet is not named "Sheet1"

## Quick Start for API Key Method

1. **Create API Key:**
   - Google Cloud Console → APIs & Services → Credentials
   - Create Credentials → API Key
   - Copy the key

2. **Enable API:**
   - APIs & Services → Library
   - Search "Google Sheets API"
   - Click Enable

3. **Make Sheet Public:**
   - Open your Google Sheet
   - Click Share button
   - Change to "Anyone with the link can view"

4. **Set Netlify Variables:**
   ```
   GOOGLE_MAPS_API_KEY = your_maps_key
   GOOGLE_SHEETS_API_KEY = your_sheets_api_key
   GOOGLE_SHEETS_ID = your_spreadsheet_id
   ```

5. **Deploy and test!**

## Your Spreadsheet Format

Make sure your first row has headers containing these keywords:
- Something with "address" or "location"
- Something with "lat" or "latitude"
- Something with "long", "lng", or "longitude"
- Something with "visit" or "visited"

The columns can be in any order!

## Documentation Updated

All documentation has been updated to reflect these changes:
- `.env.example` - Shows both authentication methods
- `CREDENTIALS_GUIDE.md` - Complete guide for both API key and service account
- Function code - Supports both methods with automatic detection

## Migration Path

If you've already set up with service account:
- **No changes needed!** Your existing setup still works
- The function tries service account first, then falls back to API key

If you want to switch to API key method:
- Remove `GOOGLE_SHEETS_CREDENTIALS` from Netlify
- Add `GOOGLE_SHEETS_API_KEY` to Netlify
- Make your sheet public
- Redeploy

## Benefits

✅ Easier to get started (API key method)  
✅ More flexible column arrangement  
✅ No need to specify exact ranges  
✅ Headers can have custom names  
✅ Add extra columns without breaking anything  
✅ Both authentication methods work seamlessly  

## Questions?

Check the updated `CREDENTIALS_GUIDE.md` for detailed setup instructions for both methods!
