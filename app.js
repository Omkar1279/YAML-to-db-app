const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./schema/schema');
const { parseYAML } = require('./utils/yamlParser');
const Node = require('./models/nodeModels');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

async function handleExistingNode(existingNode, newNodeData, parent = null) {
  console.log(`Node with same data already exists: ${newNodeData.name}`);

  // Delete the existing node
  await Node.findByIdAndDelete(existingNode._id);
  console.log(`Deleted existing node: ${newNodeData.name}`);

  // Create the new node and its descendants
  await createNode(newNodeData, parent);

  console.log(`Updated existing node: ${newNodeData.name}`);
}


async function createNode(nodeData, parent = null) {
  try {
    const existingNode = await Node.findOne({ name: nodeData.name });

    if (existingNode) {
      await handleExistingNode(existingNode, nodeData, parent);
    } else {
      console.log(`Creating node: ${nodeData.name}`);
      const newNode = await Node.create({
        name: nodeData.name,
        type: nodeData.type,
        description: nodeData.description,
      });

      if (parent) {
        parent.children.push(newNode._id);
        await parent.save();
      }

      if (nodeData.children && Array.isArray(nodeData.children)) {
        for (const childData of nodeData.children) {
          console.log(`Creating child node: ${childData.name}`);
          await createNode(childData, newNode);
        }
      }

      console.log(`Node created: ${nodeData.name}`);
    }
  } catch (error) {
    console.error('Error while creating node:', error.message);
    process.exit(1); // Exit the app in case of an error
  }
}

// Load MongoDB URI from environment variables
const mongodbUri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listeners for MongoDB connection
mongoose.connection.once('open', () => {
  console.log('Connected to the database');
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit the app in case of MongoDB connection error
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
    console.log('Passing YAML data...');
    // await Node.deleteMany({}); // Clear the existing data in the database (optional)
    const yamlFilePath = './sample.yaml'; // Change this to the actual file path
    const yamlData = parseYAML(yamlFilePath);
  
    console.log('Parsing YAML data completed.');
  
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
  
    console.log('Saving YAML data to the database...');
    // Create parent nodes with children
    for (const nodeData of yamlData) {
      await createNode(nodeData, null);
    }
  
    console.log('YAML data saved to the database successfully');
  } catch (error) {
    console.error('Error while saving YAML data to the database:', error.message);
    process.exit(1); // Exit the app in case of an error
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
