const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');
const { readFileSync } = require('fs');
const { join } = require('path');

// read the schema file for the definitions
const schemaString = readFileSync(join(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

// pass the definitions to graphql-tools to make it executable
const schema = makeExecutableSchema({
  typeDefs: schemaString,
  // we hide this for mocking only
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  // each key in this object represents a type that you can mock a generic resposne for
  mocks: {
    Query: () => ({}),
    Mutation: () => ({}),
  }
});

module.exports = schema
