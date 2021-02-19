import { useMutation } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import {REGISTER_MUTATION} from '../GraphqQL/Mutations/AccountMutation';
import {TitleImage} from './title-image'
import {Link , useHistory} from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux';

const GeneralWrapper = styled.div`

display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
height:70%;
width:100%;

`

const InputBox = styled.input` margin-bottom:10px `

const RegisterPage = ( props )=>{

    const history = useHistory();
    const errorState = useSelector( ( state = {} ) => state.error );

    const [ register , { data , loading , error } ] = useMutation(REGISTER_MUTATION , {

            onCompleted:( { registerUser } )=>{

                history.push(`/login/?username=${registerUser.username}`);

            } ,

            onError:(error)=>{ console.log(error); }

    })

    let userNameRef , passwordRef , email;  
 
    const onRegister = ()=>{

        register({

            variables:{
                user:{
                    username:userNameRef.value || null,
                    email:email.value || null,
                    password:passwordRef.value || null
                }
            }
        })

    }

    return <GeneralWrapper>

    <TitleImage text = "Register to the Group-Chat" />

        { loading ? <h6> Registering... </h6> : null }
        
        { error ? <h5 style={{ color:"red"} } > { errorState.errorType + " " + errorState.message } </h5> : null}

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