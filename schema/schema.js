const { gql } = require('apollo-server-express');
const Node = require('../models/nodeModels');

// Define your GraphQL schema using SDL
const typeDefs = gql`
  # Node represents a node in the database.
  type Node {
    _id: ID! # Unique ID for the node
    name: String! # Name of the node
    type: String! # Type of the node
    description: String! # Description of the node
    children: [Node] # List of child nodes (if any)
  }

  # Input type for adding or updating a node.
  input NodeInput {
    name: String! # Name of the node
    type: String! # Type of the node
    description: String! # Description of the node
    children: [ID] # List of IDs of child nodes (if any)
  }

  type Query {
    # Retrieve a node by its unique ID.
    getNodeById(id: ID!): Node

    # Retrieve nodes by their type.
    getNodesByType(type: String!): [Node]

    # Retrieve nodes by their name.
    getNodesByName(name: String!): [Node]

    # Define other query types in future
  }

  type Mutation {
    # Add a new node to the database.
    addNode(input: NodeInput!): Node

    # Update an existing node in the database.
    updateNode(id: ID!, input: NodeInput!): Node

    # Define other mutation types in future
  }
`;

const resolvers = {
  Query: {
    // Resolver to fetch a node by its unique ID.
    getNodeById: async (_, { id }) => {
      try {
        const node = await Node.findById(id).populate('children');
        if (!node) {
          throw new Error('Node not found');
        }
        return node;
      } catch (error) {
        console.error('Error while fetching node:', error.message);
        throw error;
      }
    },
    // Resolver to fetch nodes by their type.
    getNodesByType: async (_, { type }) => {
      try {
        const nodes = await Node.find({ type }).populate('children');
        return nodes;
      } catch (error) {
        console.error('Error while fetching nodes by type:', error.message);
        throw error;
      }
    },
    // Resolver to fetch nodes by their name.
    getNodesByName: async (_, { name }) => {
      try {
        const nodes = await Node.find({ name }).populate('children');
        return nodes;
      } catch (error) {
        console.error('Error while fetching nodes by name:', error.message);
        throw error;
      }
    },
    // Implement other query resolvers based on your requirements
  },
  Mutation: {
    // Resolver to add a new node to the database.
    addNode: async (_, { input }) => {
      try {
        // Validate input data
        if (!input.name || !input.type || !input.description) {
          throw new Error('Name, type, and description are required');
        }

        // Create a new node and save it to the database
        const newNode = await Node.create(input);
        return newNode;
      } catch (error) {
        console.error('Error while adding node:', error.message);
        throw error;
      }
    },
    // Resolver to update an existing node in the database.
    updateNode: async (_, { id, input }) => {
      try {
        // Validate input data
        if (!input.name || !input.type || !input.description) {
          throw new Error('Name, type, and description are required');
        }

        // Find the node by ID and update its properties
        const updatedNode = await Node.findByIdAndUpdate(id, input, {
          new: true,
        }).populate('children');

        if (!updatedNode) {
          throw new Error('Node not found');
        }

        return updatedNode;
      } catch (error) {
        console.error('Error while updating node:', error.message);
        throw error;
      }
    },
    // Implement other mutation resolvers based on your requirements
  },
};

module.exports = { typeDefs, resolvers };