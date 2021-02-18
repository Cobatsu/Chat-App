import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import { useQuery , useMutation , useSubscription } from '@apollo/client'
import {TitleImage} from './title-image'

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

    return <GeneralWrapper>

        <TitleImage/>

        <InputBox placeholder="Username" />

        <InputBox placeholder="Password" type="password" />
        
        <button> LOG IN </button>


    </GeneralWrapper>

}



export default LoginPage;