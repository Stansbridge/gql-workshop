const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const { express: voyagerMiddleware } = require('graphql-voyager/middleware')

const mocks = require('./mocks');

const VOYAGER_ROUTE = '/voyager';
const PLAYGROUND_ROUTE = '/playground';
const PORT = 3666;

// give the mock schema to ApolloServer
const graphqlServer = new ApolloServer({ schema: mocks });

const app = express();
// enable cross origin resource sharing
app.use(cors());
// mount voyager visualization
app.use(VOYAGER_ROUTE, voyagerMiddleware({ endpointUrl: graphqlServer.graphqlPath }));
// mount playground test-bed
app.get(PLAYGROUND_ROUTE, expressPlayground({ endpoint: graphqlServer.graphqlPath }));
// enable graphql endpoint
graphqlServer.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
  console.table([
    { application: 'Voyager', route: `http://localhost:${PORT}${VOYAGER_ROUTE}` },
    { application: 'Playground', route: `http://localhost:${PORT}${PLAYGROUND_ROUTE}` },
    { application: 'GraphQL', route: `http://localhost:${PORT}${graphqlServer.graphqlPath}` },
  ])
});
