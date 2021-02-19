import {gql} from '@apollo/client'

export const REGISTER_MUTATION = gql`

    mutation Register($user:RegisterInput!){

        registerUser(user:$user) {
            username
        }

    }
    
`