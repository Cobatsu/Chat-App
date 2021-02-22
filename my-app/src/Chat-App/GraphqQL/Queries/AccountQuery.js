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


export const CHECK_TOKEN_QUERY = gql`

    query Check {
         checkToken {
            username
            email
            _id
         }
    }

`