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

    // Save data to public/data/nodes.json
    const dataPath = path.join(process.cwd(), 'public', 'data', 'nodes.json');
    await fs.writeFile(
      dataPath,
      JSON.stringify({ nodes, links }, null, 2)
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
