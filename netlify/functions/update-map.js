/**
 * Netlify Function to fetch data from Google Sheets
 * This function supports two authentication methods:
 * 1. Service Account (recommended for private sheets)
 * 2. API Key (requires publicly accessible sheets)
 */

const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
    
    // Sheet range is optional - if not specified, will fetch all data
    // If specified, can be like "Sheet1" or "Sheet1!A:D"
    const sheetRange = process.env.GOOGLE_SHEETS_RANGE || 'Sheet1';

    if (!spreadsheetId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing Google Sheets configuration',
          message: 'Please set GOOGLE_SHEETS_ID in Netlify environment variables'
        })
      };
    }

    let sheets;
    
    // Try service account first (more secure, works with private sheets)
    if (credentialsJson) {
      try {
        const credentials = JSON.parse(credentialsJson);
        if (credentials.client_email && credentials.private_key) {
          const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
          });
          sheets = google.sheets({ version: 'v4', auth });
        }
      } catch (parseError) {
        console.error('Failed to parse service account credentials:', parseError);
      }
    }
    
    // Fallback to API key (requires public sheet)
    if (!sheets && apiKey) {
      sheets = google.sheets({ version: 'v4', auth: apiKey });
    }
    
    // If neither authentication method is available
    if (!sheets) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing authentication',
          message: 'Please set either GOOGLE_SHEETS_API_KEY or GOOGLE_SHEETS_CREDENTIALS in Netlify environment variables'
        })
      };
    }


    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetRange,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No data found in spreadsheet' })
      };
    }

    // Automatically detect column mapping from header row
    const headerRow = rows[0];
    const columnMapping = {};
    
    // Find columns by header names (case-insensitive)
    headerRow.forEach((header, index) => {
      const normalizedHeader = (header || '').toLowerCase().trim();
      const originalHeader = (header || '').trim();
      if (originalHeader.includes('Address') || normalizedHeader.includes('address') || normalizedHeader.includes('location')) {
        columnMapping.address = index;
      } else if (normalizedHeader.includes('lat')) {
        columnMapping.latitude = index;
      } else if (normalizedHeader.includes('long') || normalizedHeader.includes('lng')) {
        columnMapping.longitude = index;
      } else if (normalizedHeader.includes('picture taken')) {
        columnMapping.visited = index;
      }
    });

    // If no headers found, assume standard column order: Address, Latitude, Longitude, Visited
    const useHeaderMapping = Object.keys(columnMapping).length >= 3;
    const dataRows = useHeaderMapping ? rows.slice(1) : rows;

    const addresses = dataRows
      .filter(row => row.length >= 3) // Must have at least 3 columns
      .map(row => {
        if (useHeaderMapping) {
          return {
            address: row[columnMapping.address] || '',
            latitude: parseFloat(row[columnMapping.latitude]) || 0,
            longitude: parseFloat(row[columnMapping.longitude]) || 0,
            visited: row[columnMapping.visited] || 'No'
          };
        } else {
          // Fallback to column order: Address, Latitude, Longitude, Visited
          return {
            address: row[0] || '',
            latitude: parseFloat(row[1]) || 0,
            longitude: parseFloat(row[2]) || 0,
            visited: row[3] || 'No'
          };
        }
      });

    // Return the data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        success: true,
        data: addresses,
        timestamp: new Date().toISOString(),
        message: 'Data fetched successfully from Google Sheets',
        detectedHeaders: useHeaderMapping
      })
    };

  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch data from Google Sheets',
        message: error.message 
      })
    };
  }
};
