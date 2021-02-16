import logo from './logo.svg';
import './App.css';
import React , {useEffect,useState} from 'react';

import {
  useMutation,
  useQuery,
  useLazyQuery,
  ApolloProvider ,
  ApolloClient ,
  gql, 
  InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri:"http://localhost:8000/graphql",
  cache: new InMemoryCache()
})



const ADD_TODO = gql`
 
  mutation AddMutation($title:String!,$description:String!) {
     addTodo(title:$title,description:$description) {
       id
       title
       description
     }
  } 

`

const GET_TODO = gql`
  query TodoList {
    todoList {
      id
      title
      description
    }
  }
`

const DELETE_TODO = gql`

  mutation DeleteTodo($id:ID!) {
    deleteTodo(id:$id) {
      id
      title
    }
  }

`



const ToDoList = ()=>{

  const { data  , loading , refetch , error } = useQuery(GET_TODO);
  const [ addTodo , { loading:addLoading  }] = useMutation(ADD_TODO);
  const [ deleteTodo , { loading:deleteLoading }] = useMutation(DELETE_TODO);

  let refTitle;
  let refDescription;

  console.log(data)

  const mainLoadingResult = deleteLoading || addLoading || loading

  const onDeleteTodo = (todoID)=>{

    deleteTodo( {variables:{id:todoID}} ).then((res)=>{ refetch(); })
  
  }

  const onAddTodo = ()=> {

    addTodo( {variables:{ title:refTitle.value, description:refDescription.value }} ).then((res)=>{ refetch(); })

  }

  return <React.Fragment>

    <div style={{width:'100%'}}> 
      
      <input placeholder="Title" ref={ title => refTitle = title }/>
      <input placeholder="Description" ref={ desc => refDescription = desc } />
      <button onClick={ onAddTodo } > ADD TODO </button>
      { mainLoadingResult &&  <span > loading... </span> }

    </div>

    <ul style={{padding:0 , width:'100%'}}>
    
        {
          data && data.todoList.map( ({ id , title , description } )=> 
          
            <li style={{ margin:5 , width:'100%', display:'flex' , justifyContent:'space-between' }} key={ id } > {title} {description} 

              <button  onClick = { onDeleteTodo.bind(null,id) } > Delete Todo </button>
          
            </li>

          )
        }

    </ul>

  </React.Fragment>
  
  
}


function App() {

  return (
     
    <ApolloProvider client = {client} >

      <div style={{margin:'5% 0 0 30%' , width:'600px'}} >

          <ToDoList/>

      </div>
     
    </ApolloProvider>

  );

}

export default App;
