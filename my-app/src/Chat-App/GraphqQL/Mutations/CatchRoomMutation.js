import {gql} from '@apollo/client'

export const CREATE_ROOM_QUERY = gql`

    mutation CreateRoom($room:RoomInput!){

        createRoom(room:$room) {
            title
            limit
        }

    }
    
`

export const ROOM_SUBSCRIPTION = gql`
  subscription RoomCReated {
    roomCreated {
      limit
      title
    }
  }
`