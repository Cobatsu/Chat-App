import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import {  useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER_ROOMS_QUERY } from '../../GraphqQL/Queries/ChatRoomQuery'

const Container = styled.div`

    padding:15px;
    display:flex;
    flex-direction:column;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    width:40%;
    height:90%;
    box-sizing: border-box;
`


const Rooms = styled.div`

width:100%;
height:100%;
display:flex;
flex-direction:column;
margin-top:25px;

`
const InnerRooms = styled.div`

display:flex;
justify-content:space-between;
padding:10px;
align-items:center;
&:hover{
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        cursor:pointer
}
transition:150ms;

`

const UserRooms = ()=>{

        const { data , loading , error  } = useQuery(GET_USER_ROOMS_QUERY, {
                fetchPolicy:"network-only"
        })
        const storeError = useSelector( ( state = {} ) => state.error ); 

        return (

                <Container>

                        <span style={{textAlign:"center"}}> Created Rooms </span>

                        <Rooms>
                                {

                                loading ? <span> Fetching... </span> : 
                                error ?   <span> {storeError.errorType + " " + storeError.message} </span> : 
                               
                                data.getUserRooms.map((room)=>{

                                        return (

                                        <InnerRooms>

                                                <span>   
                                                        <i style={{marginRight:8 , color:"#1687a7" }} class="fas fa-comment"></i>
                                                        {room.title}
                                                </span>

                                                <span>
                                                        <i style={{marginRight:8 , color:"#1687a7"}} class="fas fa-user-friends"></i>
                                                        {room.limit + "/" + room.members.length }                              
                                                </span>

                                        </InnerRooms> 

                                        )

                                  })                
                                }
                        </Rooms>

                </Container>

        )
}


export default UserRooms;