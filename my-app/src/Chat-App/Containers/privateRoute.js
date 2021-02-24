import React , {useEffect} from 'react';
import { useLazyQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { CHECK_TOKEN_QUERY } from '../GraphqQL/Queries/AccountQuery'
import  {useDispatch} from 'react-redux'
import { Route } from 'react-router-dom'

const PrivateRoute = ( { component:Component , ...rest } )=>{

    let history = useHistory();
    let dispatch = useDispatch();

    let [ check , { loading , data } ] = useLazyQuery(CHECK_TOKEN_QUERY , {
  
        context:{
          history
        } ,

        fetchPolicy:"network-only",

        onCompleted:({checkToken})=>{

            dispatch({
                type:"SET_USER",
                payload:checkToken
              })

        } , 
 
    })


    useEffect(()=>{
        
        check() ; 
      
    },[])
  
    return <Route {...rest} 
    
        component = { props => ( 

            !loading && data ? <Component {...props} /> : null
        
        ) } />
  
}

export default PrivateRoute;