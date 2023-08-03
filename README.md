# YAML to Database Backend Application

The "YAML to Database" backend application is a Node.js application that allows users to parse a YAML file, save its contents into a MongoDB database, and interact with the data using GraphQL APIs. The application is designed to handle YAML data representing nodes with parent-child relationships and provides functionalities to query, update, and retrieve data from the database.

## Features

- Parse YAML data and store it in a MongoDB database with appropriate data schema.
- Define GraphQL schema and resolvers to enable users to interact with the database.
- Query nodes by ID, type, and name, including their child nodes.
- Add new nodes to the database.
- Update existing nodes in the database.
- Add children to an existing node.

## Setup and Installation

To run the project, follow these steps:

1. Ensure you have installed [Node.js](https://nodejs.org/en/download/package-manager)
and [npm](https://docs.npmjs.com/cli/v8/commands/npm-install) on your system.
2. Clone the repository to your local machine and navigate to the project root directory.
3. Install the required dependencies using npm: `npm install`.
4. Create a `.env` file in the project root with the MongoDB connection string: `MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>`.
5. Ensure you have a YAML file (e.g., `sample.yaml`) containing the data you want to store in the database.

To start the application, run: `npm start`. The YAML data will be parsed and saved to the MongoDB database. The GraphQL playground will be accessible at `http://localhost:4000/graphql`, where you can interact with the GraphQL APIs.

## Project Structure

The project is organized as follows:

- `node_modules/`: Contains the installed Node.js modules.
- `models/`: Contains the Mongoose model for the Node schema used in MongoDB.
- `schema/`: Contains the GraphQL schema definition and resolvers for the Node type and mutations.
- `utils/`: Contains the `yamlParser.js` file that handles parsing YAML data from the provided YAML file.
- `app.js`: The main application file where the Apollo Server and Express are set up, and the YAML data is parsed and saved to the database.
- `sample.yaml`: A sample YAML file provided with the project for testing purposes.
- `queries.graphql`: A GraphQL query file with example queries for fetching node data.
- `package.json`: Contains information about the project dependencies and scripts.

## GraphQL Schema

The GraphQL schema defined in `schema.js` includes the following types and operations:

### type Node

Represents a node in the database.
- `_id: ID!`: Unique ID for the node.
- `name: String!`: Name of the node.
- `type: String!`: Type of the node.
- `description: String!`: Description of the node.
- `children: [Node]`: List of child nodes (if any).

### input NodeInput

Input type for adding or updating a node.
- `name: String!`: Name of the node.
- `type: String!`: Type of the node.
- `description: String!`: Description of the node.
- `children: [ID]`: List of IDs of child nodes (if any).

### input AddChildrenInput

Input type for adding children to a node.
- `nodeId: ID!`: ID of the node to which children will be added.
- `childrenIds: [ID]!`: List of IDs of child nodes to be added.

### type Query

Defines the queries that can be performed.
- `getNodeById(id: ID!): Node`: Retrieve a node by its unique ID.
- `getNodesByType(type: String!): [Node]`: Retrieve nodes by their type.
- `getNodesByName(name: String!): [Node]`: Retrieve nodes by their name.
- `getNodes: [Node]`: Retrieve all nodes.

### type Mutation

Defines the mutations that can be performed.
- `addNode(input: NodeInput!): Node`: Add a new node to the database.
- `updateNode(id: ID!, input: NodeInput!): Node`: Update an existing node in the database.
- `addChildrenToNode(input: AddChildrenInput!): Node`: Add children to an existing node in the database.

## Data Model

The data model for nodes in the MongoDB database is defined in `nodeModel.js` using Mongoose. Each node has the following fields:
- `name`: Name of the node (required).
- `type`: Type of the node (required).
- `description`: Description of the node (required).
- `children`: List of references to child nodes (if any).

## Conclusion

The "YAML to Database" backend application is now set up and ready to use. You can interact with the GraphQL APIs to query, update, and retrieve node data based on your requirements.

Please make sure to have a MongoDB instance running and provide the correct connection string in the `.env` file before running the project. Enjoy using the app!

If you face any issues or have questions, please refer to the project's documentation or reach out to the project maintainer.

Thank you for using the "YAML to Database" app! Happy coding!

