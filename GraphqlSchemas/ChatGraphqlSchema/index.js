const {makeExecutableSchema} = require ('apollo-server');
const resolvers = require('./Resolvers/index');
const schemas   = require('./Schemas/index');

module.exports = makeExecutableSchema({
    typeDefs:schemas,
    resolvers:resolvers
})
