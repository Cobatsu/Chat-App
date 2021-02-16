const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server')
const schema = require('./TypesAndResolvers');
require('dotenv').config();
const _Url = process.env.DB_URL

mongoose.connect(_Url,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(()=>console.log('connected to DB'))
.catch((err)=>console.log(err));

const server = new ApolloServer( { schema } );

server.listen('8000').then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});