const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const path = require("path");
const db = require('./utils/mongodb')
var compression = require('compression')
require('dotenv').config()


const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers/resolvers')


const pubsub = new PubSub();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req, pubsub })}); 
  
  server.applyMiddleware({
      app,
      onHealthCheck: () =>
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
            resolve();
        } else {
            reject();
        }
    })
  });

  if ( process.env.NODE_ENV ==="production"){

    const path = require("path");
    app.use(express.static(path.join(__dirname, "client/build")));

    app.get("*", (req, res) => {

        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));

    })

console.log(port)
}
app.listen(port, () => console.log(``));