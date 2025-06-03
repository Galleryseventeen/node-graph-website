const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    if (event.method !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
    }

    const { nodes, links } = JSON.parse(event.body);

    // Validate data
    if (!Array.isArray(nodes) || !Array.isArray(links)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid data format' }),
      };
    }

    // Get the absolute path to the nodes.json file
    const filePath = path.join(__dirname, '../../public/data/nodes.json');
    
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
