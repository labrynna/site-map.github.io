# Architecture Overview

This document explains how the application works with Netlify hosting and secure credential management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              index.html (Frontend)                       │  │
│  │  - Displays interactive Google Map                       │  │
│  │  - Shows location list with filters                      │  │
│  │  - Fetches API key from Netlify Function                 │  │
│  │  - Loads data from Google Sheets or static JSON          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTPS Requests
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      NETLIFY HOSTING                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Netlify Serverless Functions                   │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  get-maps-key.js                                   │  │  │
│  │  │  - Returns Google Maps API key                     │  │  │
│  │  │  - Key stored in environment variable              │  │  │
│  │  │  - Never exposed to browser                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  update-map.js                                     │  │  │
│  │  │  - Fetches data from Google Sheets                 │  │  │
│  │  │  - Uses service account credentials                │  │  │
│  │  │  - Returns formatted location data                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Environment Variables (Secure Storage)            │  │
│  │  - GOOGLE_MAPS_API_KEY                                   │  │
│  │  - GOOGLE_SHEETS_CREDENTIALS (Service Account JSON)     │  │
│  │  - GOOGLE_SHEETS_ID                                      │  │
│  │  - GOOGLE_SHEETS_RANGE                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ API Calls (with credentials)
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
         ▼                                     ▼
┌─────────────────────┐            ┌────────────────────────┐
│  Google Maps API    │            │   Google Sheets API    │
│                     │            │                        │
│  - Displays map     │            │  - Stores location data│
│  - Shows markers    │            │  - Address info        │
│  - Interactive UI   │            │  - Coordinates         │
│                     │            │  - Visit status        │
└─────────────────────┘            └────────────────────────┘
```

## Data Flow

### 1. Initial Page Load

```
Browser → Netlify (index.html)
   ↓
Browser → /.netlify/functions/get-maps-key
   ↓
Function reads GOOGLE_MAPS_API_KEY from env variables
   ↓
Function returns { apiKey: "..." }
   ↓
Browser loads Google Maps with the API key
   ↓
Browser → /.netlify/functions/update-map
   ↓
Function authenticates with Google Sheets using service account
   ↓
Function fetches data from spreadsheet
   ↓
Function returns { data: [...locations...] }
   ↓
Browser displays locations on map
```

### 2. Update Map Button Click

```
User clicks "Update Map" button
   ↓
Browser → POST /.netlify/functions/update-map
   ↓
Function authenticates with Google Sheets
   ↓
Function fetches latest data
   ↓
Function returns updated location data
   ↓
Browser refreshes page
   ↓
Map displays updated locations
```

## Security Architecture

### What's Protected ✅

1. **Google Maps API Key**
   - Stored in: Netlify environment variable
   - Accessed by: `get-maps-key.js` function only
   - Never exposed: To browser source code or Git
   - Can be restricted: To Netlify domain in Google Cloud Console

2. **Google Sheets Credentials**
   - Stored in: Netlify environment variable (JSON format)
   - Accessed by: `update-map.js` function only
   - Never exposed: To browser or Git
   - Minimal permissions: Service account has Viewer role only

3. **Spreadsheet ID**
   - Stored in: Netlify environment variable
   - Accessed by: `update-map.js` function only
   - Not exposed: In client-side code

### Security Layers

```
┌────────────────────────────────────────────────────┐
│ Layer 1: Git (.gitignore)                         │
│ - .env files never committed                      │
│ - Secrets never in repository                     │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│ Layer 2: Netlify Environment Variables            │
│ - Encrypted storage                               │
│ - Only accessible to functions during runtime     │
│ - Not visible in browser                          │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│ Layer 3: Serverless Functions                     │
│ - Act as secure proxy                             │
│ - Server-side execution only                      │
│ - Credentials never sent to browser               │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│ Layer 4: Google Cloud Security                    │
│ - API key restrictions (domain, API type)         │
│ - Service account minimal permissions             │
│ - Usage quotas and monitoring                     │
└────────────────────────────────────────────────────┘
```

## Comparison: Before vs After

### Before (GitHub Pages)

```
❌ Hardcoded API key in index.html
   - Visible in browser source
   - Exposed in Git repository
   - Anyone can copy and misuse

❌ External webhook (n8n)
   - Separate service dependency
   - Additional cost
   - More complex setup

❌ Manual file updates
   - Need to commit addresses.json changes
   - Requires Git knowledge
```

### After (Netlify)

```
✅ API key in environment variables
   - Not visible in browser
   - Not in Git repository
   - Secured by Netlify

✅ Integrated serverless functions
   - No external services needed
   - Included in Netlify free tier
   - Simple deployment

✅ Automatic Google Sheets sync
   - Edit sheet, data updates automatically
   - No Git commits needed
   - Non-technical users can update
```

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Hosting**: Netlify
- **Serverless Functions**: Netlify Functions (Node.js)
- **APIs**: 
  - Google Maps JavaScript API
  - Google Sheets API v4
- **Authentication**: Google Service Account (OAuth 2.0)
- **Data Storage**: Google Sheets + Static JSON (fallback)

## Deployment Process

```
1. Developer commits code to GitHub
      ↓
2. GitHub triggers Netlify build
      ↓
3. Netlify deploys static files
      ↓
4. Netlify builds serverless functions
      ↓
5. Functions get access to environment variables
      ↓
6. Site is live and secure
```

## File Structure

```
site-map.github.io/
├── index.html                    # Frontend application
├── addresses.json                # Static fallback data
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies for functions
├── .gitignore                    # Prevent committing secrets
├── .env.example                  # Template for local development
│
├── netlify/
│   └── functions/
│       ├── get-maps-key.js      # Returns API key securely
│       └── update-map.js         # Fetches Google Sheets data
│
└── Documentation/
    ├── README.md                 # Main documentation
    ├── NETLIFY_SETUP.md         # Setup instructions
    ├── CREDENTIALS_GUIDE.md     # Environment variable guide
    ├── MIGRATION_SUMMARY.md     # User summary
    └── ARCHITECTURE.md          # This file
```

## Environment Variables Workflow

```
Developer sets in Netlify Dashboard:
┌──────────────────────────────────────┐
│ GOOGLE_MAPS_API_KEY=xyz123...        │
│ GOOGLE_SHEETS_CREDENTIALS={"type":..│
│ GOOGLE_SHEETS_ID=abc456...           │
│ GOOGLE_SHEETS_RANGE=Sheet1!A:D       │
└──────────────────────────────────────┘
                ↓
    Netlify stores securely
                ↓
    Functions access via process.env
                ↓
    Functions make API calls
                ↓
    Functions return data to browser
                ↓
    API keys never exposed to users
```

## Benefits of This Architecture

1. **Security**: Credentials never exposed to browser or Git
2. **Simplicity**: No external services (n8n) needed
3. **Cost-effective**: Netlify free tier covers typical usage
4. **Maintainability**: Easy to update data (edit Google Sheet)
5. **Scalability**: Serverless functions scale automatically
6. **User-friendly**: Non-technical users can update locations
7. **Version control**: Code separate from data
8. **Reliability**: Fallback to static JSON if API fails

## Future Enhancements Possible

- Add Google Drive integration (same credentials work)
- Implement caching for faster loads
- Add admin UI for direct editing
- Implement user authentication
- Add location search functionality
- Export data to different formats
- Integrate with other Google Workspace tools

---

This architecture provides a secure, scalable, and maintainable solution for displaying location data on a map while protecting sensitive credentials.
