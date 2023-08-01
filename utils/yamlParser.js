const fs = require('fs');
const yaml = require('js-yaml');

// Function to parse YAML data from the input file
const parseYAML = (filePath) => {
  try {
    // Read the content of the YAML file
    const yamlContent = fs.readFileSync(filePath, 'utf8');

    // Parse the YAML data and return the JavaScript object
    return yaml.load(yamlContent);
  } catch (error) {
    console.error('Error while parsing YAML file:', error.message);
    throw error;
  }
};

module.exports = { parseYAML };
