import React , {useEffect,useState} from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import {  useHistory } from 'react-router-dom'
import { useSubscription , useQuery , useMutation } from '@apollo/client'
import { GET_OTHER_ROOMS_QUERY } from '../../GraphqQL/Queries/ChatRoomQuery'
import { JOIN_ROOM_MUTATION , MEMBER_JOINED_ROOM } from '../../GraphqQL/Mutations/CatchRoomMutation'


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
`

const Refresh = styled.div`
position:absolute;
left:0;
&:hover{
        cursor:pointer
}

`


const OtherRooms = ()=>{

        const { data , loading , error , refetch , subscribeToMore } = useQuery(GET_OTHER_ROOMS_QUERY, {
               fetchPolicy:"network-only"
        })

        const [ join ]  = useMutation(JOIN_ROOM_MUTATION , {
                onError:(error)=>console.log(error)
        });
        
        const storeError = useSelector( ( state = {} ) => state.error ); 

        const reFresh = () => { 
                
            refetch(); // refetch only allows the component rerender when data is loaded

        }

        const joinRoom = (id)=>(e)=>{
 
            join({
                    variables:{
                        roomID:id
                     }
               })

        }

        useEffect(()=>{

                subscribeToMore({

                        document:MEMBER_JOINED_ROOM,
                        updateQuery:(prev, { subscriptionData } )=>{

                            if (!subscriptionData.data) return prev;
                                
                            const {memberJoined:{user,roomID}} = subscriptionData.data;

                            const newData = prev.getOtherRooms.map((obj,_)=>{

                                        if( roomID == obj._id ) {

                                                if( 1 + obj.members.length > obj.limit ) { // it is the limit

                                                        return obj;

                                                } else {

                                                        return { 
                                                                ...obj,
                                                                members:[
                                                                        ...obj.members,
                                                                        user
                                                                ]
                                                        }

                                                }
                                               

                                        } else {

                                                return obj;

                                        }

                            })  

                            return {
                                getOtherRooms:newData // this data format must be the same as old one
                            };
                        }
                })

        },[])

        return (

                <Container>

                        <span style={{textAlign:"center",position:'relative'}} > 
                                
                                Other Rooms
                                <Refresh onClick={reFresh} className="fas fa-sync" ></Refresh> 
                        
                        </span>

                        <Rooms>
                                {

                                loading ? <span> Fetching... </span> : 
                                error ?   <span> {storeError.errorType + " " + storeError.message} </span> : 
                               
                                data.getOtherRooms.map((room)=>{

                                        return (

                                        <InnerRooms key={room._id} onClick={joinRoom(room._id)} >

                                                <span style={{display:'flex',alignItems:'center',justifyContent:'flex-start',flex:1}} >   
                                                        <i style={{marginRight:8 , color:"#00af91" }} className="fas fa-comment"></i>
                                                        {room.title.length > 5 ? room.title.slice(0,5) + "..." : room.title} 
                                                </span>


                                                <span style={{display:'flex',alignItems:'center',justifyContent:'flex-start',flex:1}} >   
                                                        <i style={{marginRight:8 , color:"#00af91" }} className="fas fa-wifi"></i>
                                                        {room.host.username} 
                                                </span>


                                                <span style={{display:'flex',alignItems:'center',
                                                color:room.members.length === room.limit ? 'red' : 'none'
                                                ,justifyContent:'space-between',width:'60px',flex:0.5}}>
                                                        <i style={{marginRight:8 , color:"#00af91" }} className="fas fa-user-friends"></i>
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


export default OtherRooms;