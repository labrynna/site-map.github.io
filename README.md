# Site Visit Map

A simple web application for displaying and managing site visit locations on Google Maps.

## Features

- Display multiple locations on an interactive Google Map
- Color-coded markers (green for visited, red for not visited)
- Filter locations by visit status
- Click markers to see location details
- Center map on specific locations
- Open locations directly in Google Maps app

## Setup Instructions

### 1. Get a Google Maps API Key

To use this application, you'll need a Google Maps API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API** for your project
4. Create credentials (API key) for your project
5. (Optional but recommended) Restrict your API key to your domain for security

For detailed instructions, visit: [Get an API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

**Note:** You may need to enable billing on your Google Cloud project, though Google provides $200 free credit per month, which is more than enough for most personal projects.

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
