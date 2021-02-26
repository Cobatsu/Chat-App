const mongoose = require('mongoose');
const { ApolloServer , AuthenticationError , UserInputError , ForbiddenError  } = require('apollo-server');
const schema = require('./GraphqlSchemas/ChatGraphqlSchema/index')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const _Url = process.env.DB_URL

mongoose.connect(_Url,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(()=>console.log('connected to DB'))
.catch((err)=>console.log(err));

const server = new ApolloServer( { schema , 
    
    subscriptions: {
            path: '/subscriptions',
    },
    
    context:async ( { req , connection } )=>{

    if(connection) {

        var token = connection.context.token

    } else {

       var token = req.headers['authorization'].split(' ')[1];       

    }
    
    try {

        const user = await jwt.verify(token,process.env.PRIVATE_KEY);
        
        return { 
            user 
        }

    } catch {

        return { user:null }

    }

            
}} );

server.listen({port:8000}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});