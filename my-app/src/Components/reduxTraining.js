import { useSelector , useDispatch , shallowEqual} from 'react-redux'
import React  from 'react';

export const ReduxTesting = ()=> {
   
    const apples = useSelector( state => state , shallowEqual )  ;
    const dispatch  = useDispatch();
    let inputRef; 

    return   <React.Fragment>

                <input type="text" ref = {(ref)=> inputRef = ref }/>
                <button onClick={()=> dispatch( { payload:inputRef.value ,type:"ADD_APPLE" } )}> ADD APPLE </button>
                <ul>
                        {
                            ( apples ).map((apple)=>{ return <li key={ Math.random() }> {apple} </li> })
                        }

                </ul>

    </React.Fragment>
  
}