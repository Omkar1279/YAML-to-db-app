// In your ./utils/yamlParser.js file, update the parseYAML function
const fs = require('fs');
const yaml = require('js-yaml');

function parseYAML(yamlFilePath) {
  try {
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8');
    const data = yaml.load(fileContents);

    // Ensure that the data is an array
    if (!Array.isArray(data)) {
      throw new Error('YAML data should be an array of objects.');
    }

    // Return the parsed data
    return data;
  } catch (error) {
    console.error('Error while parsing YAML data:', error.message);
    return [];
  }
}

module.exports = { parseYAML };
