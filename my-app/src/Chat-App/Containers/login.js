import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import { useQuery , useMutation , useSubscription , useLazyQuery } from '@apollo/client'
import {LOGIN_QUERY} from '../GraphqQL/Queries/AccountQuery';
import {TitleImage} from './title-image'
import {Link} from 'react-router-dom'

const GeneralWrapper = styled.div`

display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
height:70%;
width:100%;

`

const InputBox = styled.input` margin-bottom:10px `


const LoginPage = ()=>{

    const [ login , { data , loading , error }] = useLazyQuery(LOGIN_QUERY);

    let userNameRef;
    let passwordRef;

    const onLogin = ()=>{

        login({
            variables:{
                user:{
                    username:userNameRef.value,
                    password:passwordRef.value
                }
            }
        })
       
    }

    return <GeneralWrapper>

        <TitleImage text = "Welcome To The Group-Chat !" />

        { loading ? <h6> Giriş Yapılıyor </h6> : null }

        <InputBox placeholder="Username" ref={ ref => userNameRef = ref } />

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