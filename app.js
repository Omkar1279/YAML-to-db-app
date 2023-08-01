const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./schema/schema');
const { parseYAML } = require('./utils/yamlParser');
const Node = require('./models/nodeModels');
// const fs = require('fs');
// const queries = fs.readFileSync('./queries.graphql', 'utf-8');

const app = express();

// Connect to MongoDB (Change the connection string accordingly, i connected it to mongodb cloud)
mongoose.connect('mongodb+srv://omkatta:36tjKBAVyiguV8am@cluster0.wbnwzl3.mongodb.net/?retryWrites=true&w=majority', {
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
    await Node.create(yamlData);
    console.log('YAML data saved to the database successfully');
  } catch (error) {
    console.error('Error while saving YAML data to the database:', error.message);
  }
}

// async function executeQueries() {
//   try {
//     // Log the contents of queries.graphql (optional)
//     console.log('Queries from queries.graphql:');
//     console.log(queries);
  
//     // Execute the queries using the Apollo Server's execute function
//     const { data, errors } = await server.executeOperation({ query: queries });
  
//     // Handle errors, if any
//     if (errors) {
//       console.error('GraphQL errors:', errors);
//       throw new Error('Error while executing queries');
//     }
  
//     // Log the data (optional)
//     console.log('Result of queries:', data);
//   } catch (error) {
//     console.error('Error while executing queries:', error);
//   }
// }

// // Call the executeQueries function
// executeQueries();


// Call the startServer function to initiate the server and database operations
startServer().then(() => {
  // Once the server is started and middleware applied, start listening for requests
  const port = 4000;
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/graphql`);
  });
});
