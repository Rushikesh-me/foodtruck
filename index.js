const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const path = require("path");
const db = require('./utils/mongodb');
const serverless = require("serverless-http");
const compression = require('compression')
const cors = require('cors')
require('dotenv').config()


const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers/resolvers')


const pubsub = new PubSub();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors({origin: '*'}));
// @ts-ignore
app.use(express.json({ limit: '20mb' }));
// @ts-ignore
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// @ts-ignore
app.use(compression());
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req, pubsub })}); 
  
  server.applyMiddleware({
      app,
      onHealthCheck: () =>
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
            // @ts-ignore
            resolve();
        } else {
            reject();
        }
    })
  });
  
// app.listen(port, () => { console.log(`Server running at http://localhost:${port}${server.graphqlPath}`) });

module.exports.handler = serverless(app, {
	binary: ["*/*"],
	request: function (request, context) {
		request.context = context;
		return request;
	},
});
