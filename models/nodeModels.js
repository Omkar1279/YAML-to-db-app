const mongoose = require('mongoose');

// Define the Node schema using Mongoose
const nodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Name field is required, with a custom error message if missing
  },
  type: {
    type: String,
    required: [true, 'Type is required'], // Type field is required, with a custom error message if missing
  },
  description: {
    type: String,
    required: [true, 'Description is required'], // Description field is required, with a custom error message if missing
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }], // References to child nodes (if any)
});

// Create the Node model using the schema
const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
