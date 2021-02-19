import logo from './logo.svg';
import './App.css';
import React , {useEffect,useState} from 'react';
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux';
import { Route ,Link , Redirect , BrowserRouter } from 'react-router-dom'
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
import Register from './Chat-App/Containers/register'
import UserReducer from './Chat-App/Reducers/userReducer'

const httpTerminatingLink = new HttpLink({
  uri:"http://localhost:8000/graphql"
});

const client = new ApolloClient({
  link:httpTerminatingLink,
  cache: new InMemoryCache()
})

const initalState = { user:{} }

const store = createStore(UserReducer,initalState);

function App() {

  return (
     
    <ApolloProvider client = {client} >

      <BrowserRouter>
        <Provider store={store}>

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

        </Provider>
      </BrowserRouter>

       
    </ApolloProvider>

  );

}

export default App;
