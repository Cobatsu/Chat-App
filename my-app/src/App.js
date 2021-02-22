import logo from './logo.svg';
import './App.css';
import React  from 'react';
import {Provider} from 'react-redux'
import { createStore } from 'redux';
import { Route ,Link , Redirect , BrowserRouter , useHistory , Switch} from 'react-router-dom'
import {
  ApolloProvider ,
  ApolloClient ,
  gql, 
  InMemoryCache,
  ApolloLink,
  HttpLink,
  from,
  split } from '@apollo/client'

import { onError } from "apollo-link-error";
import Login from './Chat-App/Containers/login'
import Register from './Chat-App/Containers/register'
import UserReducer from './Chat-App/Reducers/userReducer'
import MainPage from './Chat-App/Containers/home/main-page';
import PrivateRoute from './Chat-App/Containers/privateRoute'
import { logout } from './Chat-App/Actions/action'
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpTerminatingLink = new HttpLink({
  uri:"http://localhost:8000/graphql"
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:8000/subscriptions",
  options: {
    reconnect: true,
    connectionParams:{
      token:localStorage.getItem('token'),
    }
  }
});

const initalState = { user:{} , error:{} }

const store = createStore(UserReducer,initalState);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpTerminatingLink,
);

const errorLink = onError(({ graphQLErrors, networkError , operation }) => { // only runs when server respones
  
  let errorType , message;
  let { history } = operation.getContext();

  if (graphQLErrors) {

    for (const el of graphQLErrors) {
             
         switch(el.extensions.code) {

          case 'UNAUTHENTICATED': 
                 store.dispatch(logout());
                 history.push('/login');
            break;
          
         }

         errorType = `[${el.extensions.code}]`;
         message = message || el.message;

    }
    
    store.dispatch({
      type:"SET_ERROR",
      payload:{
        errorType,
        message
      }
    })

  }

  if (networkError) { console.log(networkError) }

});

const middleWareLink = new ApolloLink( ( operation , forward )=>{

  const token = localStorage.getItem('token');
  
  operation.setContext({
    headers: {
      ...operation.getContext().headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  })

  return forward(operation);

})

export const client = new ApolloClient({
  link:from([
    middleWareLink,
    errorLink,
    splitLink
  ]),
  cache: new InMemoryCache()
})


function App() {
   
  return (
     
    <ApolloProvider client = {client} >

      <BrowserRouter>
        <Provider store={store}>

          <Switch>

                <Route path="/login" component= { Login } />
                <Route path="/register" component={ Register } />

                <PrivateRoute path="/main-page"  component = {MainPage} />

          </Switch>

        </Provider>
      </BrowserRouter>

       
    </ApolloProvider>

  );

}

export default App;
