const usersResolvers = require('./users');
const profileResolvers = require('./profile')
const truckResolvers = require('./trucks')

module.exports = {
  Query: {
    ...profileResolvers.Query,
    ...truckResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...truckResolvers.Mutation
  }
};