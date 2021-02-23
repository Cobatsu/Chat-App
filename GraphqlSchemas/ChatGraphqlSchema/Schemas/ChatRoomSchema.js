const { gql } = require('apollo-server');

const chatRoomSchema = gql`

type Room {
    _id:ID!
    limit:Int!
    title:String!
    host:User!
    members:[User!]!
}

type RoomSubscripton {
    user:User!
    roomID:ID!
}

input RoomInput {
    limit:Int!
    title:String!
}

type Subscription {
    memberJoined: RoomSubscripton!
}

extend type Query{
    getUserRooms:[Room!]!
    getOtherRooms:[Room!]!
}

extend type Mutation {
    createRoom(room:RoomInput!) : Room!
    joinRoom(roomID:ID!) : Room!
}

`

module.exports = chatRoomSchema;