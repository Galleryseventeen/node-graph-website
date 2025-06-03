const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    // Get the absolute path to the nodes.json file
    const filePath = path.join(__dirname, '../../public/data/nodes.json');
    
    // Read and parse the JSON file
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message || 'Failed to load data' })
    };
  }
};
