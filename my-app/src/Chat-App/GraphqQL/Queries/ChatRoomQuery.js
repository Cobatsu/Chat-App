import {gql} from '@apollo/client'

export const GET_USER_ROOMS_QUERY = gql`

    query GetRooms{
        getUserRooms {
            _id
            limit
            title
            members {
                username
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
            host{
                username
                _id
            }
            members {
                username
                _id
            }
        }
    }

`


export const GET_CHAT_ROOM_QUERY = gql`

    query GetChatRoom {

        getChatRoom {

            messages {
                text
                owner
                date
            }

            members {
                username
                _id
            }

        }

    }

`