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
    mutation JoinRoom($roomID:ID!) {
        joinRoom(roomID:$roomID) {
            _id,
            title,
            limit
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