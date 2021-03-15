import {gql} from '@apollo/client'

export const CREATE_ROOM_MUTATION = gql`

    mutation CreateRoom($room:RoomInput!){

        createRoom(room:$room) {
            title
            limit
        }

    }
    
`

export const JOIN_ROOM_MUTATION = gql`
    mutation JoinRoom($roomID:ID!,$limit:Int!,$memberLength:Int!) {
        joinRoom(roomID:$roomID,limit:$limit,memberLength:$memberLength) {
            _id
            title
            limit
        }
    }
`

export const LEAVE_ROOM_MUTATION = gql`

    mutation LeaveRoom($roomID:ID!) {

        leaveRoom(roomID:$roomID) {

            title
            _id

        }

    }


`




export const MEMBER_JOINED_ROOM = gql`

    subscription MemberJoined {
        memberJoined {

             user {
                username
                _id         
             }
            
             roomID
        }
    }

`

export const SEND_MESSAGE_MUTATION = gql`

    mutation SendMessage($text:String!,$roomID:ID!) {

        sendMessage(text:$text,roomID:$roomID) {
            
            _id
            text

        }

    }

`

export const DELETE_MESSAGE_MUTATION = gql`

    mutation DeleteMessage($messageID:ID!,$roomID:ID!) {

        deleteMessage(messageID:$messageID,roomID:$roomID) {
            _id
            text
        }
    }
`


export const MESSAGE_SENT = gql`

    subscription MessageSent($roomID:ID!) {

        messageSent(roomID:$roomID) {

            _id
            text
            date
            owner {
                username
                _id
            }

        }

    }

`


export const MESSAGE_DELETED = gql `

    subscription MessageDeleted($roomID:ID!) {

        messageDeleted(roomID:$roomID) {
            _id
            text
        }

    }
 
`   

export const MEMBER_JOINED_ROOM_CHAT_ROOM = gql`

    subscription MemberJoinedRoom($roomID:ID!) {

        memberJoinedRoom(roomID:$roomID) {
                username
                _id
        }

    }

`

