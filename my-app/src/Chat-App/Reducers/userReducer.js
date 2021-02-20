import { client } from '../../App'


const UserReducer = ( state , action )=>{
 
    
    switch( action.type ) {

        case "SET_USER": 

            return {
                ...state,
                user:action.payload,
            }

        case "SET_ERROR": 

            return {
                ...state,
                 error:action.payload
            }
            

        case "LOGOUT": 

            localStorage.removeItem('token');
            client.clearStore();
            
            return {
                user:{},
                error:{}
            }    
        
        default: 
             
            break;

    }

}


export default UserReducer;