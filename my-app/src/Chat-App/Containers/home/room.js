import React, {useEffect} from 'react';
import { useSubscription , useQuery , useMutation } from '@apollo/client'
import { GET_CHAT_ROOM_QUERY } from '../../GraphqQL/Queries/ChatRoomQuery'
import { SEND_MESSAGE_MUTATION , MESSAGE_SENT } from '../../GraphqQL/Mutations/CatchRoomMutation'
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';

const GeneralWrapper = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    height:100%;
    width:88%;
    margin:0 auto;
`


const ChatBox = styled.div`

    height:530px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    box-sizing: border-box;
    flex:0.5;
    margin-left:30px;
    padding:20px;

`
const Members = styled.div`

    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    height:530px;
    flex:0.20;
    display:flex;
    flex-direction:column;
    border-radius:8px;
    align-items:center; 
    box-sizing: border-box;
    padding:10px;

`
//................................

const TextPart = styled.div`
    display:flex;
    width:100%;
    flex:0.06;
`

const ChatTextInput = styled.input`

    flex:0.85;
    padding:2px;
    height:30px;
    font-size:15px;

`

const Send = styled.button`

    background:#28527a;
    color:white;
    border:none;
    flex:0.15;
    &:hover{
        cursor:pointer
    }
`

const Messages = styled.ul`
    
 flex:0.94;
 width:100%;
 display:flex;
 flex-direction:column;
 list-style: none;
 padding:0;
`

const InnerMessage = styled.li`

 width:100%;
 display:flex;
 list-style: none;
 justify-content:${( {checkOwner} )=> checkOwner ? 'flex-end' : 'flex-start'};
 padding:5px;

`

const TextBubble = styled.span`
 background:#03506f;
 color:white;
 padding:8px;
 border-radius:5px;

`


const Room = ({match})=>{

    const { data , loading , error , subscribeToMore } = useQuery(GET_CHAT_ROOM_QUERY,{
        fetchPolicy:"network-only",
        variables:{
            roomID:match.params.id
        }
    });

    const currentUser = useSelector((state = {}) => state.user);
    
    let chatText;
    const [ send ] = useMutation(SEND_MESSAGE_MUTATION)

    const sendMessage = ()=>{

        send({
                variables:{
                        text:chatText.value,
                        roomID:match.params.id
                }
        })

    }

    useEffect(()=>{

        subscribeToMore({
            variables:{
                roomID:match.params.id
            },
            document:MESSAGE_SENT,
            updateQuery:(prev, { subscriptionData })=>{

                const subMessage = subscriptionData.data.messageSent;
                
                const updatedData = Object.assign({},prev.getChatRoom,{ // object assign changes the original object !

                    messages:{
                        subMessage , ...prev.getChatRoom.messages
                    }

                }) // this updates the present value

                return {
                    getChatRoom:updatedData
                }

            }
        })

    },[])

    return <GeneralWrapper> 
        
            
            <Members>

                <span style={{color:"#845ec2"}}> GROUP MEMBERS </span>

                <ul style={{ padding:0,listStyle:"none" , width:"50%" , marginTop:30 }}>

                    {
                        data && data.getChatRoom.members.map((member)=>{

                            return (

                            <li style={{padding:5,width:"100%",display:"flex",justifyContent:"center"}} key={member._id} > 

                                {member.username} 
                                <i class="fas fa-user" style={{color:"#f14668",marginLeft:14}}></i>
                                
                                
                            </li>

                        )})
                        
                    }

                </ul>

            </Members>

            <ChatBox>

                     { loading ? " Messages are loading...."  : <Messages>


                        {
                                data && data.getChatRoom.messages.map((msg,index)=>{
                                        return (
                                        
                                        <InnerMessage key={index} checkOwner={ msg.owner._id == currentUser._id } >

                                            <TextBubble> 

                                                {msg.text}

                                            </TextBubble>

                                        </InnerMessage> 
                                        
                                    )
                                })
                        }

                     </Messages> }

                    <TextPart>

                            <ChatTextInput ref={ ref => chatText = ref }/>
                            <Send onClick={sendMessage} > SEND </Send>

                    </TextPart>
                   

            </ChatBox>
        
    </GeneralWrapper>


}

export default Room;