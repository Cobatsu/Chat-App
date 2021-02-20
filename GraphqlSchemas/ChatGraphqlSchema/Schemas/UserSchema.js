const { gql } = require('apollo-server');

const ChatUser = gql`

type User { 
  _id:ID!
  username:String!
  password:String!
  email:String!
  jwt:String!
}

input RegisterInput {
    username:String!
    password:String!
    email:String!
}

input LoginInput {
    username:String!
    password:String!
}

type Mutation {

    registerUser(user:RegisterInput!):User!
    
}

type Query {

    loginUser(user:LoginInput!):User!
    checkToken:User!

}

`

module.exports = ChatUser;