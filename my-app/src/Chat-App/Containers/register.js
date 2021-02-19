import { useMutation } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import {REGISTER_MUTATION} from '../GraphqQL/Mutations/AccountMutation';
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

const RegisterPage = ()=>{

    const [ register , { data , loading , error } ] = useMutation(REGISTER_MUTATION)

    let userNameRef;
    let passwordRef;
    let email;

    const onRegister = ()=>{

    }

    return <GeneralWrapper>

    <TitleImage text = "Register to the Group-Chat" />

        { loading ? <h6> Giriş Yapılıyor </h6> : null }

        <InputBox placeholder="Username" ref={ ref => userNameRef = ref } />

        <InputBox placeholder="email" ref={ ref => email = ref }  />

        <InputBox placeholder="Password" ref={ ref => passwordRef = ref } type="password" />
        
        <button onClick={ ()=>{ onRegister(); } } > REGISTER </button>

        <Link to={{
            pathname:"/login"
        }}  style ={{
             textDecoration:'none',
             fontSize:13,
             margin:5
        }}> Go to Login ! </Link>

    </GeneralWrapper>;

}

export default RegisterPage;