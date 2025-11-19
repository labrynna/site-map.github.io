/**
 * Netlify Function to fetch data from Google Sheets and update addresses.json
 * This function authenticates with Google Sheets using service account credentials
 * stored securely in Netlify environment variables.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Get credentials from environment variables
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const sheetName = process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A:D'; // Default range

    if (!credentials.client_email || !credentials.private_key || !spreadsheetId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing Google Sheets configuration',
          message: 'Please ensure GOOGLE_SHEETS_CREDENTIALS and GOOGLE_SHEETS_ID are set in Netlify environment variables'
        })
      };
    }

    // Initialize Google Sheets API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetName,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No data found in spreadsheet' })
      };
    }

    // Convert rows to addresses format (skip header row if present)
    const hasHeader = rows[0] && (
      rows[0][0]?.toLowerCase().includes('address') || 
      rows[0][0]?.toLowerCase().includes('location')
    );
    
    const dataRows = hasHeader ? rows.slice(1) : rows;

    const addresses = dataRows
      .filter(row => row.length >= 3) // Must have at least address, lat, lng
      .map(row => ({
        address: row[0] || '',
        latitude: parseFloat(row[1]) || 0,
        longitude: parseFloat(row[2]) || 0,
        visited: row[3] || 'No'
      }));

    // In Netlify Functions, we can't write directly to the file system in a persistent way
    // Instead, we return the data and the client will handle it
    // For persistent storage, you would need to use:
    // - Netlify Blobs
    // - GitHub API to commit the file
    // - Or another external storage solution

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
        message: 'Data fetched successfully from Google Sheets'
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
