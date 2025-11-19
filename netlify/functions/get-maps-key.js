/**
 * Netlify Function to provide Google Maps API key securely
 * This function returns the API key from environment variables
 * so it's not exposed in the client-side code.
 */

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Google Maps API key not configured',
          message: 'Please set GOOGLE_MAPS_API_KEY in Netlify environment variables'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=3600' // Cache for 1 hour
      },
      body: JSON.stringify({ apiKey })
    };

  } catch (error) {
    console.error('Error fetching API key:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch API key',
        message: error.message 
      })
    };
  }
};
