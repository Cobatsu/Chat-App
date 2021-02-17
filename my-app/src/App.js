import logo from './logo.svg';
import './App.css';
import React , {useEffect,useState} from 'react';
import ToDoList from './Todo'
import {
  ApolloProvider ,
  ApolloClient ,
  gql, 
  InMemoryCache,
  ApolloLink,
  HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'



const setAuthorizationLink = new ApolloLink( ( operation , forward )=>{

  console.log(operation);

   return forward(operation);

});

const httpTerminatingLink = new HttpLink({
  uri:"http://localhost:8000/graphql"
});

const client = new ApolloClient({
  link:setAuthorizationLink.concat(httpTerminatingLink),
  cache: new InMemoryCache()
})


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
