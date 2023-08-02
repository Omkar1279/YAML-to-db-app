const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./schema/schema');
const { parseYAML } = require('./utils/yamlParser');
const Node = require('./models/nodeModels');
require('dotenv').config(); // Load environment variables from .env file
// const fs = require('fs');
// const queries = fs.readFileSync('./queries.graphql', 'utf-8');

const app = express();

const mongodbUri = process.env.MONGODB_URI;
// Connect to MongoDB (Change the connection string accordingly, i connected it to mongodb cloud)
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listeners for MongoDB connection
mongoose.connection.once('open', () => {
  console.log('Connected to database');
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Format GraphQL errors for better clarity in responses
    console.error('GraphQL error:', error.message);
    return error;
  },
});

// Start the server and apply middleware once it's started
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Save the YAML data into the database
  try {
    await Node.deleteMany({}); // Clear the existing data in the database (optional)
    const yamlFilePath = './sample.yaml'; // Change this to the actual file path
    const yamlData = parseYAML(yamlFilePath);
    // Validate the YAML data before saving it to the database
    if (!Array.isArray(yamlData)) {
      throw new Error('YAML data should be an array of objects.');
    }

    // Validate each object in the array
    for (const node of yamlData) {
      if (
        typeof node.name !== 'string' ||
        typeof node.type !== 'string' ||
        typeof node.description !== 'string'
      ) {
        throw new Error('Each node object in the YAML data should have "name", "type", and "description" properties of type string.');
      }

      // You can add further validation if needed based on your data requirements
    }

    // Create parent nodes with children
    for (const nodeData of yamlData) {
      // Create the parent node
      const parentNode = await Node.create({
        name: nodeData.name,
        type: nodeData.type,
        description: nodeData.description,
      });

      // Check if the current node has children
      if (nodeData.children && Array.isArray(nodeData.children)) {
        // Create the child nodes and associate them with the parent node
        for (const childData of nodeData.children) {
          const childNode = await Node.create({
            name: childData.name,
            type: childData.type,
            description: childData.description,
          });
          parentNode.children.push(childNode._id);
        }

        // Save the updated parent node with the child references
        await parentNode.save();
      }
    }

    console.log('YAML data saved to the database successfully');
  } catch (error) {
    console.error('Error while saving YAML data to the database:', error.message);
  }
}


// Call the startServer function to initiate the server and database operations
startServer().then(() => {
  // Once the server is started and middleware applied, start listening for requests
  const port = 4000;
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/graphql`);
  });
});
