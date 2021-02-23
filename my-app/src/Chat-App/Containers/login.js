import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import { useLazyQuery } from '@apollo/client'
import {LOGIN_QUERY} from '../GraphqQL/Queries/AccountQuery';
import {TitleImage} from './title-image'
import {Link , useHistory, useLocation } from 'react-router-dom'
import queryString from 'querystring'


const GeneralWrapper = styled.div`

display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
height:70%;
width:100%;

`

const InputBox = styled.input` margin-bottom:10px `


const LoginPage = ( props )=>{

    const dispatch = useDispatch();
    const errorState = useSelector( ( state = {} ) => state.error );
    const history = useHistory();

    const location = useLocation() ; 

    const { username } = queryString.parse(location.search.slice(1)) ; 

    var userNameRef , passwordRef;

    const [ login , {  loading , error  }] = useLazyQuery(LOGIN_QUERY , {

        onCompleted:({ loginUser })=>{

            localStorage.setItem('token',loginUser.jwt);

            dispatch({
                type:"SET_USER",
                payload:loginUser
            }); 

            history.push('/main-page');

        },

    });
  
    const onLogin = ()=>{

        login({
            variables:{
                user:{
                    username:userNameRef.value || null,
                    password:passwordRef.value || null
                }
            }
        })
       
    }

    return <GeneralWrapper>

        <TitleImage text = "Welcome To The Group-Chat !" />
        
        { username ? <h5 style={{
            color:"green"
        }}> You Registered. Lets Sign In ! </h5> : null }

        { loading ? <h6> Giriş Yapılıyor </h6> : 
          error ?   <h5 style={{
              color:"red"
          }}> { errorState.errorType + " " + errorState.message } </h5> : null
        }

        <InputBox placeholder="Username" ref={ ref => userNameRef = ref } value={ username } />

        <InputBox placeholder="Password" ref={ ref => passwordRef = ref } type="password" />
        
        <button onClick={ ()=>{ onLogin(); } } > LOG IN </button>

        <Link to={{
            pathname:"/register"
        }} style={{
            textDecoration:'none',
            fontSize:13,
            margin:5
        }}> Go to Register ! </Link>

    </GeneralWrapper>

}



export default LoginPage;