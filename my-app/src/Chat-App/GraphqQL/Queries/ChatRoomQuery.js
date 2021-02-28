import {gql} from '@apollo/client'

export const GET_USER_ROOMS_QUERY = gql`

    query GetRooms{
        getUserRooms {

            _id
            limit
            title
            members{
                username
                _id
            }

        }
    }

`
  
export const GET_OTHER_ROOMS_QUERY = gql`

    query GetOtherRooms{
        getOtherRooms {

            _id
            limit
            title
            members{
                username
                _id
            }
            host{
                username
                _id
            }
         
        }
    }

`


export const GET_CHAT_ROOM_QUERY = gql`

    query GetChatRoom($roomID:ID!) {

        getChatRoom(roomID:$roomID) {

            host {
                _id
            }

            messages {
                text
                owner {
                    username
                    _id
                }
                date
            }

            members {
                username
                _id
            }

        }

    }

`