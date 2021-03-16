const { gql } = require('apollo-server');

const chatRoomSchema = gql`

type Room {
    _id:ID!
    limit:Int!
    title:String!
    host:User!
    members:[User!]!
    messages:[Message!]!
}

type Message {
    _id:ID!
    owner:User!
    text:String!
    date:String!
    actionType:String!
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
    message(roomID:ID!):  Message!
    memberJoinedRoom(roomID:ID!): User!
}

extend type Query{
    getUserRooms:[Room!]!
    getOtherRooms:[Room!]!
    getChatRoom(roomID:ID!):Room!
}

extend type Mutation {
    createRoom(room:RoomInput!) : Room!
    joinRoom(roomID:ID!,limit:Int!,memberLength:Int!) : Room!
    leaveRoom(roomID:ID!) : Room!
    sendMessage(text:String!,roomID:ID!) : Message!
    deleteMessage(roomID:ID!,messageID:ID!) : Message!
}

`

module.exports = chatRoomSchema;