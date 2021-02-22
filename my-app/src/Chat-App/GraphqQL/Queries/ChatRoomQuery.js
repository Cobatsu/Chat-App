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
