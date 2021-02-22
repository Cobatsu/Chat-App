const { gql } = require('apollo-server');

const chatRoomSchema = gql`

type Room {
    _id:ID!
    limit:Int!
    title:String!
    host:User!
    members:[User!]!
}

input RoomInput {
    limit:Int!
    title:String!
}

type Subscription {
    roomCreated: Room!
}

extend type Query{
    getUserRooms:[Room!]!
}

extend type Mutation {
    createRoom(room:RoomInput!) : Room!
}

`

module.exports = chatRoomSchema;