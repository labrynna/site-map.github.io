/**
 * Netlify Function to return the n8n webhook URL from environment variables
 * This keeps the webhook URL secure and not exposed in the frontend code
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
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    // Return the webhook URL if it exists, otherwise return empty
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        webhookUrl: webhookUrl || null
      })
    };
  } catch (error) {
    console.error('Error fetching n8n webhook URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch n8n webhook URL',
        message: error.message 
      })
    };
  }
};
