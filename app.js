const express = require('express');
const { graphqlHTTP } = require('express-graphql');
var bodyParser = require('body-parser');
const app = express();
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const TodoModel = require('./schema');
const cors = require('cors');
require('dotenv').config();
const _Url = process.env.DB_URL


mongoose.connect(_Url,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(()=>console.log('connected to DB'))
.catch((err)=>console.log(err));

app.use(cors()) ;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(function(req, res, next) { 

    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next();

}); 



app.use(

  '/graphql',

  graphqlHTTP({

    schema: buildSchema(`
    
    type ToDo {
    
        id: ID!
        title: String
        description: String!

    }

    type Query {

        todoList:[ToDo!]!

    }

    type Mutation {

        addTodo(title:String!,description:String!) : ToDo!
        deleteTodo(id:ID!): ToDo
       
    }

    schema {
        query:Query
        mutation:Mutation
    }
    
    
    `),
    rootValue:{

        todoList:async ()=>{

            const Todos = await TodoModel.find();
           
            return Todos;

        },
        addTodo:async (args)=>{

            const newTodo = new TodoModel({
                title:args.title,
                description:args.description
            })

            const lastTodo = await newTodo.save();
            
            return lastTodo;

        },
        deleteTodo:async (args)=>{

            const deleted = await TodoModel.findByIdAndDelete({_id:args.id});

            return deleted;

        }
    },
  }),
);

app.listen(8000, () => console.log('Gator app listening on port 8000!'));
