import {gql} from '@apollo/client'

export const LOGIN_QUERY = gql`

    query Login( $user:LoginInput! ){
        loginUser( user:$user) {
            username
            email
            jwt
            _id
        }
    }

`