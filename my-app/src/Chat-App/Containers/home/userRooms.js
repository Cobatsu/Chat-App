import React , {useEffect} from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import {  useHistory } from 'react-router-dom'
import { useQuery , NetworkStatus , useMutation } from '@apollo/client'
import { GET_USER_ROOMS_QUERY } from '../../GraphqQL/Queries/ChatRoomQuery'
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

const UserRooms = ( { timeToRefetch , setTimeToRefetch} )=>{

        const { data , loading , error , refetch  } = useQuery(GET_USER_ROOMS_QUERY, {
                fetchPolicy:"network-only",        
                notifyOnNetworkStatusChange:true  
        });

        const history = useHistory();

        const [ join ]  = useMutation(JOIN_ROOM_MUTATION , {

                onError:(error)=> console.log(error) ,

                onCompleted:({joinRoom})=>{

                        history.push('/room/'+joinRoom._id);

                }

        });


        const storeError = useSelector( ( state = {} ) => state.error ); 

        useEffect(()=>{

                if(timeToRefetch) {

                        refetch().then(()=>{

                                setTimeToRefetch(false);
                 
                        })

                }
              
        },[timeToRefetch]);

        
        const joinRoom = (id,limit,memberLength)=>(e)=>{
 
                join({

                    variables:{
                        roomID:id,
                        limit,
                        memberLength
                     }

               })

        }


        return (

                <Container>

                        <span style={{textAlign:"center"}}> Created Rooms </span>

                        <Rooms>
                                {

                                loading ? <span> Fetching... </span> : 
                                error ?   <span> {storeError.errorType + " " + storeError.message} </span> : 
                               
                                data.getUserRooms.map((room)=>{

                                        return (

                                        <InnerRooms key={room._id}  onClick={joinRoom(room._id,room.limit,room.members.length)} >

                                                <span style={{display:'flex',alignItems:'center'}} >   
                                                        <i style={{marginRight:8 , color:"#f05454" }} className="fas fa-comment"></i>
                                                        {room.title.length > 10 ? room.title.slice(0,10) + " ..." : room.title} 
                                                </span>

                                                <span style={{display:'flex',alignItems:'center',width:'60px',justifyContent:'space-between'}}>
                                                        <i style={{marginRight:8 , color:"#f05454" }} className="fas fa-user-friends"></i>
                                                        { room.members.length+ "/" +  room.limit}                             
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