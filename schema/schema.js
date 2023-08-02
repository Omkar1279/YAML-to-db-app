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

  # Input type for adding children to a node.
  input AddChildrenInput {
    nodeId: ID! # ID of the node to which children will be added
    childrenIds: [ID]! # List of IDs of child nodes to be added
  }

  type Query {
    # Retrieve a node by its unique ID.
    getNodeById(id: ID!): Node

    # Retrieve nodes by their type.
    getNodesByType(type: String!): [Node]

    # Retrieve nodes by their name.
    getNodesByName(name: String!): [Node]

    getNodes: [Node]
  }

  type Mutation {
    # Add a new node to the database.
    addNode(input: NodeInput!): Node

    # Update an existing node in the database.
    updateNode(id: ID!, input: NodeInput!): Node

    # Add children to an existing node in the database.
    addChildrenToNode(input: AddChildrenInput!): Node
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

    getNodes: async () => {
      try {
        const nodes = await Node.find().populate('children');
        return nodes;
      } catch (error) {
        console.error('Error while fetching nodes:', error.message);
        throw error;
      }
    },
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

    addChildrenToNode: async (_, { input }) => {
      try {
        const { nodeId, childrenIds } = input;

        // Find the node by ID
        const node = await Node.findById(nodeId).populate('children');
        if (!node) {
          throw new Error('Node not found');
        }

        // Find the children nodes by their IDs
        const childrenNodes = await Node.find({ _id: { $in: childrenIds } });
        if (childrenNodes.length !== childrenIds.length) {
          throw new Error('One or more child nodes not found');
        }

        // Add the children nodes to the parent node
        node.children.push(...childrenNodes);

        // Save the updated node to the database
        await node.save();

        return node;
      } catch (error) {
        console.error('Error while adding children to node:', error.message);
        throw error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };