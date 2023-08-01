# YAML-to-db-app Development Instructions

## Project Overview

The task is to create a web application that takes a YAML file as input, parses it, and saves its contents into a database. Each entry in the YAML file has four keys: {name, type, description, children} and should correspond to one node in the database. Additionally, we need to implement APIs (preferably GraphQL) that allow users to query, update, and alter the database to maintain relevant node data using filters.

## Technical Requirements

1. Backend Application:
    - Use Node.js and Express.js to build the backend application.
    - Implement a YAML parser (js-yaml) to read and parse the input YAML file.
    - Set up a connection to a MongoDB database to store the YAML data.

2. Database Schema:
    - Design an appropriate database schema to represent each node's information from the YAML file.
    - The schema should be flexible enough to handle different types of data found in the YAML file.

3. Saving Data:
    - Create an endpoint to receive the YAML file, parse it, and store the data into the database.
    - Validate the YAML data before saving it to the database to ensure consistency.

4. APIs (Optional):
    - Set up a GraphQL server using a library like Apollo Server.
    - Design GraphQL queries and mutations to allow users to fetch or update specific node data using various filters (e.g., by ID, type, name, etc.).

## Project Deliverables

1. A fully functional backend application that parses a YAML file and saves its contents into the database.

2. A well-designed database schema representing each node's information from the YAML file.

3. Properly documented code and setup instructions for the backend application.

4. (Optional) If GraphQL is implemented, API documentation detailing the available queries and mutations for data retrieval and manipulation.


## Backend Application: 
We'll use Node.js and Express.js to build the backend application, as they are popular choices for handling YAML and database operations in JavaScript. MongoDB will be used as the database to store the YAML data due to its flexibility and compatibility with JavaScript-based applications.

#### YAML Parsing: 
To read and parse the input YAML file, we'll use the `js-yaml` library in Node.js. It will allow us to easily load and manipulate the YAML data.

#### Database Selection: 
For this project, we'll use MongoDB as the database to store the YAML data. MongoDB's flexible schema will be suitable for handling the different data types found in the YAML file.

#### Database Schema: 
In MongoDB, we'll design a schema to represent each node's information from the YAML file. MongoDB's schemaless nature will allow us to store the YAML data without strict pre-defined schemas.

#### API Implementation: 
We'll set up a GraphQL server using the `apollo-server-express` library in Node.js. GraphQL will provide a flexible and efficient way to fetch and manipulate data from the MongoDB database.

#### GraphQL Schema: 
We'll design the GraphQL schema with queries and mutations to allow users to fetch or update specific node data using various filters like ID, type, and name.

#### API Endpoints: 
In the Express.js server, we'll create the necessary GraphQL API endpoints to handle queries and mutations. The GraphQL API will handle the YAML parsing, database operations, and data validation.

Given that we are using Node.js, Express.js, GraphQL, and MongoDB for the backend, we'll focus on completing the essential features of the application while leveraging the strengths of these technologies. If time allows, we'll consider adding additional features to enhance the application's functionality.

