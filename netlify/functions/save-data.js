const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    // Check if request is POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse request body
    const { nodes, links } = JSON.parse(event.body);

    // Validate data
    if (!Array.isArray(nodes) || !Array.isArray(links)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid data format' })
      };
    }

    // Get the absolute path to the nodes.json file
    const filePath = path.join(__dirname, '../../public/data/nodes.json');
    
    // Ensure the data directory exists
    const dataDir = path.dirname(filePath);
    await fs.mkdir(dataDir, { recursive: true });

    // Write the data with proper formatting
    await fs.writeFile(
      filePath,
      JSON.stringify({ nodes, links }, null, 2),
      'utf8'
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Data saved successfully' })
    };
  } catch (error) {
    console.error('Error saving data:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message || 'Failed to save data' })
    };
  }
};
