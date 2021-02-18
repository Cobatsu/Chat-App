import logo from './logo.svg';
import './App.css';
import React , {useEffect,useState} from 'react';
import ToDoList from './Todo'
import {Provider} from 'react-redux'
import {createStore} from 'redux';
import {
  ApolloProvider ,
  ApolloClient ,
  gql, 
  InMemoryCache,
  ApolloLink,
  HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ReduxTesting as Apples } from './reduxTraining'

const testReducer = ( state , action )=>{

  switch(action.type) {

    case "ADD_APPLE":
      return state.concat(action.payload);

    case "DELETE_APPLE":
      return state.filter((apple)=> apple != action.payload );

    default:
      return state; 

  }

}

const store = createStore( testReducer , ["heyy"] );

const setAuthorizationLink = new ApolloLink( ( operation , forward )=>{

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

      <Provider store={store}>
          <Apples/>
      </Provider>
       
    </ApolloProvider>

  );

}

export default App;
