const Node = require('./nodeModels');

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

module.exports = resolvers;
