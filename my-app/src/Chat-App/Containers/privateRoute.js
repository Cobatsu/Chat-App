import React , {useEffect} from 'react';
import { useLazyQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { CHECK_TOKEN } from '../GraphqQL/Queries/AccountQuery'
import  {useDispatch} from 'react-redux'
import { Route } from 'react-router-dom'

const PrivateRoute = ( { component:Component , ...rest } )=>{

    let history = useHistory();
    let dispatch = useDispatch();

    let [ check , { loading , data } ] = useLazyQuery(CHECK_TOKEN , {
  
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

        render = { props => ( 

            !loading && data ? <Component/> : null
        
        ) } />
  
}

export default PrivateRoute;