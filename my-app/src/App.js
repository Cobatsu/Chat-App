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
  HttpLink,
  from } from '@apollo/client'
import { setContext  } from '@apollo/client/link/context'
import { ReduxTesting as Apples } from './Components/reduxTraining'
import thunk from 'redux-thunk'  
import { onError } from "apollo-link-error";
import Login from './Chat-App/Containers/login'
import Register from './Chat-App/Containers/register'
import UserReducer from './Chat-App/Reducers/userReducer'

const httpTerminatingLink = new HttpLink({
  uri:"http://localhost:8000/graphql"
});

const initalState = { user:{} , error:{} }

const store = createStore(UserReducer,initalState);

const errorLink = onError(({ graphQLErrors, networkError }) => {

  if (graphQLErrors)

      store.dispatch({
        type:'SET_ERROR',
        payload:{
          message:graphQLErrors[0].message,
          errorType:"[GraphQL Error]"
        }
      })

  if (networkError) {
    
    store.dispatch({
      type:'SET_ERROR',
      payload:{
        message:networkError,
        errorType:"[Network Error]"
      }
    })

  }

});

const client = new ApolloClient({
  link:from([
    errorLink,
    httpTerminatingLink
  ]),
  cache: new InMemoryCache()
})

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
