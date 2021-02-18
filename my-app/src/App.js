import logo from './logo.svg';
import './App.css';
import React , {useEffect,useState} from 'react';
import ToDoList from './Components/Todo'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux';
import {
  ApolloProvider ,
  ApolloClient ,
  gql, 
  InMemoryCache,
  ApolloLink,
  HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ReduxTesting as Apples } from './Components/reduxTraining'
import thunk from 'redux-thunk'  
import Login from './Chat-App/Containers/login'


const httpTerminatingLink = new HttpLink({
  uri:"http://localhost:8000/graphql"
});

const client = new ApolloClient({
  link:httpTerminatingLink,
  cache: new InMemoryCache()
})

const store = createStore(()=>{},{});


function App() {

  return (
     
    <ApolloProvider client = {client} >

      <Provider store={store}>
     
          <Login/>

      </Provider>
       
    </ApolloProvider>

  );

}

export default App;
