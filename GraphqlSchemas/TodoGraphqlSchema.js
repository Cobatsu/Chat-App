const { gql , makeExecutableSchema } = require('apollo-server')
const TodoModel = require('../Models/TodoModel');

const typeDefs = `

    type ToDo {
        
        id: ID!
        title: String!
        description: String!

    }

    type Query {

        todoList:[ToDo!]!

    }

    type Mutation {

        addTodo(title:String!,description:String!) : ToDo!
        deleteTodo(id:ID!): ToDo
    
    }

`


const resolvers = {

    Query:{

        todoList:async ()=>{

            const Todos = await TodoModel.find();
           
            return Todos;
    
        }
    }

  ,

    Mutation:{    

        addTodo:async (parent,args)=>{

        const newTodo = new TodoModel({
            title:args.title,
            description:args.description
        })

        const lastTodo = await newTodo.save();
        
        return lastTodo;

     },

        deleteTodo:async (parent,args)=>{

         const deleted = await TodoModel.findByIdAndDelete({_id:args.id});

            return deleted;

        }

  }
   
}

module.exports = makeExecutableSchema( { typeDefs , resolvers} );