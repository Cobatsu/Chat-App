const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const schema = require('./GraphqlSchemas/ChatGraphqlSchema/index')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const _Url = process.env.DB_URL

mongoose.connect(_Url,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(()=>console.log('connected to DB'))
.catch((err)=>console.log(err));

const server = new ApolloServer( { schema , context:async ({req})=>{
    
    const token = req.headers['authorization'].split(' ')[1];       
    const { operationName } = req.body;

    if(token) {

         const user = await jwt.verify(token);
         req.user = user;

    } else {

        if( operationName == "Login" ||  operationName == "Register") {

                return ;

        } else { 
            
                throw new Error("Access Denied");

        }

    }

}} );

server.listen('8000').then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});