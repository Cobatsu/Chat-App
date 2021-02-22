import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import {  useHistory } from 'react-router-dom'
import {useSubscription} from '@apollo/client'
import { ROOM_SUBSCRIPTION } from '../../GraphqQL/Mutations/CatchRoomMutation'

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

`

const OtherRooms = ()=>{

        const { data , loading } = useSubscription(ROOM_SUBSCRIPTION);

        return (

                <Container>

                        <span style={{textAlign:"center"}} > Other Rooms </span>

                        <Rooms>
                                {
                                        ( !loading  && data ) && 
                                        
                                        data.roomCreated.title + " " +  data.roomCreated.limit
                                }
                        </Rooms>

                </Container>

        )
}


export default OtherRooms;