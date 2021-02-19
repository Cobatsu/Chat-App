
const UserReducer = ( state , action )=>{
 
    

    switch( action.type ) {

        case "SET_USER": 

            return {
                ...state,
                user:{
                    username:action.payload.username,
                    email:action.payload.email,
                    _id:action.payload._id
                },
            }

        case "SET_ERROR": 

            return {
                ...state,
                 error:{
                     ...state.error,
                     message:action.payload.message,
                     type:action.payload.errorType,
                 }
            }
            

        default: 

            return state

    }

}


export default UserReducer;