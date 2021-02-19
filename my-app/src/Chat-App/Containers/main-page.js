import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import { useQuery , useMutation , useSubscription , useLazyQuery } from '@apollo/client'
import {LOGIN_QUERY} from '../GraphqQL/Queries/AccountQuery';
import {TitleImage} from './title-image'
import {Link , useHistory, useLocation } from 'react-router-dom'
import queryString from 'querystring'

const GeneralWrapper = styled.div`
display:flex;
justify-content:space-around;
align-items:center;
height:100%;
width:88%;
margin:0 auto;
`

const InnerDiv = styled.div`

height:450px;
box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
flex:0.75
`

const LogOut = styled.div`

position:fixed;
height:40px;
width:100px;
top:10px;
left:10px;
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
&:hover{
 cursor:pointer;
 background:blue;
 color:white;
 transition:100ms;
}
display:flex;
align-items:center;
justify-content:center;
`

const UserInformation = styled.div`
display:flex;
flex-direction:column;
align-items:flex-start;
width:90%;
`

const Profile = styled.div`

box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
height:450px;
flex:0.20;
display:flex;
flex-direction:column;
align-items:center;
border-radius:8px;
`
const TextSpan = styled.span`
  font-size:16px;
  margin:3px;
`

const MainPage = ()=>{

    const currentUser = useSelector(( state = {} ) => state.user );
    const dispatch = useDispatch();
    const history = useHistory();


    const onLogout = ()=>{

        localStorage.removeItem('token');
        dispatch({type:"LOGOUT"});
        history.push("/login");

    }

    return <GeneralWrapper> 

         <LogOut onClick={ ()=> onLogout() } >
             LOG OUT
         </LogOut>

         <Profile>
            
            <img src="/userpng.png" width="80%" style={{marginBottom:20 , marginTop:10}}/>

            <UserInformation>

                  <TextSpan> username : {currentUser.username} </TextSpan>
                  <TextSpan> email : {currentUser.email} </TextSpan>  
                  <TextSpan> room number :  </TextSpan>  

            </UserInformation>
        
         </Profile>

         <InnerDiv/>
    
    </GeneralWrapper>

}


export default MainPage;