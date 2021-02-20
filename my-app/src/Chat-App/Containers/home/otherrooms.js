import React from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import {  useHistory } from 'react-router-dom'


const Container = styled.div`

    display:flex;
    flex-direction:column;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    width:40%;
    height:90%;
    padding:15px;
    box-sizing: border-box;

`

const Title = styled.span`

`
const Rooms = styled.div`

width:100%;
height:100%;

`

const OtherRooms = ()=>{

        return (

                <Container>

                        <Title> Other Rooms </Title>
                        <Rooms/>

                </Container>

        )
}


export default OtherRooms;