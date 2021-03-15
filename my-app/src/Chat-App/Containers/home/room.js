import React, {useEffect , useState} from 'react';
import { useSubscription , useQuery , useMutation } from '@apollo/client'
import { GET_CHAT_ROOM_QUERY } from '../../GraphqQL/Queries/ChatRoomQuery'
import { SEND_MESSAGE_MUTATION , MESSAGE_SENT , MESSAGE_DELETED  , MEMBER_JOINED_ROOM_CHAT_ROOM , DELETE_MESSAGE_MUTATION} from '../../GraphqQL/Mutations/CatchRoomMutation'
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';


const GeneralWrapper = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    height:100%;
    margin:0 auto;
    background:#3797a4;
    position:relative;
`


const ChatBox = styled.div`

    height:530px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    box-sizing: border-box;
    width:55%;
    margin-left:30px;
    padding:10px;
    background:white;
    border-radius:8px;

`
const Members = styled.div`

    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    height:530px;
    width:15%;
    display:flex;
    flex-direction:column;
    border-radius:8px;
    align-items:center; 
    box-sizing: border-box;
    padding:10px;
    background:white;

`
//................................

const TextPart = styled.div`
    display:flex;
    justify-content:space-between;
    width:100%;
    flex:0.06;
`

const ChatTextInput = styled.input`

    flex:0.83;
    height:30px;
    font-size:17px;
    background:#6f9eaf;
    color:white;
    border:none;
    border-radius:8px;
    padding:5px 10px;
    outline: none;

`

const Send = styled.button`

    background:#ef4f4f;
    color:white;
    border:none;
    border-radius:8px;
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
 overflow:scroll;
 overflow-x: hidden;
`

const DeleteTextBubble = styled.div`

align-items:center;
justify-content:center;
display:flex;
overflow: hidden;
width:0;
transition:110ms;
`


const InnerMessage = styled.li`

 width:100%;
 display:flex;
 list-style: none;
 flex-direction:${ ({checkOwner})=> checkOwner ? 'row' : 'row-reverse'}; 
 justify-content:flex-end;
 padding:5px 15px 5px 15px;
 box-sizing: border-box;
 &:hover {
    background:${ ({checkOwner})=> checkOwner ? '#f8f1f1' : 'auto'};
 }
 &:hover ${DeleteTextBubble}{
    width:auto;
    padding:0 7px;
    cursor:pointer;
}
 
`

const TextBubble = styled.div`
 background: #6f9eaf;
 color:white;
 padding:6px;
 border-radius:5px;
 max-width:35%;
 white-space:normal;
 overflow-wrap: break-word;
`

const TextInformationBubble = styled.span`
display:flex;
flex-direction:column;
justify-content:center;
font-size:12px;
padding:0 7px;
align-items:center;
color:${({memberColor})=>memberColor};
font-weight:600;
`

const LeaveGroup = styled.button`

    background:#ef4f4f;
    color:white;
    border:none;
    border-radius:8px;
    font-size:12px;
    &:hover{
        cursor:pointer
    }
    position:absolute;
    top:20px;
    left:20px;
    padding:10px;

`


const memberColors = [ "BlueViolet ", "Chartreuse", "DarkCyan", "DarkGoldenRod", "DarkBlue", "DarkRed", "DarkOrange", "Indigo" , "Purple" , "YellowGreen"];

const Room = ({match})=>{

    const { data , loading , error , subscribeToMore } = useQuery(GET_CHAT_ROOM_QUERY,{
        variables:{
            roomID:match.params.id
        }
    });

    const [ send , { loading:Loading } ] = useMutation(SEND_MESSAGE_MUTATION);
    const [ deleteMessage ] = useMutation(DELETE_MESSAGE_MUTATION);

    const currentUser = useSelector((state = {}) => state.user);
    
    const OnSendMessage = ()=>{

        if(chatText.value) {

            send({
                variables:{
                        text:chatText.value || null,
                        roomID:match.params.id || null
                }
            })

        }

    }

    const OnDeleteMessage = (ID)=>(e)=>{

            deleteMessage({
                variables:{
                    messageID:ID || null,
                    roomID:match.params.id || null
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
                
                const mergedData = Object.assign({},prev.getChatRoom,{
                    messages:prev.getChatRoom.messages.concat(subMessage)
                })  // message type must be the same shape as prevmessagetype

                return {
                    getChatRoom:mergedData  
                } 

            }
        })

        subscribeToMore({ // we can write a function that handles both delete and send actions but it is okay just for now 
            variables:{
                roomID:match.params.id
            },
            document:MESSAGE_DELETED,
            updateQuery:(prev , { subscriptionData } )=>{

                const deletedMessage = subscriptionData.data.messageDeleted

                const updatedData = Object.assign({},prev.getChatRoom,{
                    messages:prev.getChatRoom.messages.filter((msg)=> msg._id != deletedMessage._id )
                })

                return {
                    getChatRoom:updatedData  
                } 

            }
        })

        subscribeToMore({
            variables:{
                roomID:match.params.id
            },
            document:MEMBER_JOINED_ROOM_CHAT_ROOM,
            updateQuery:(prev,{subscriptionData})=>{

                const joinedMember = subscriptionData.data.memberJoinedRoom;        

                const mergedData = Object.assign({},prev.getChatRoom,{
                    members:[...prev.getChatRoom.members, joinedMember]
                })

                return {
                    getChatRoom:mergedData
                }

            }
        })

    },[])

    let chatText;

    return <GeneralWrapper> 

            <LeaveGroup>  <i class="fas fa-sign-out-alt"></i> LEAVE THE ROOM </LeaveGroup>
            
            <Members>

                <span style={{color:"#ef4f4f",fontSize:13,fontWeight:"600",letterSpacing:1}}> 
                
                    GROUP MEMBERS 
                    
                    <span style={{marginLeft:5}}>
                        
                        { data &&  
                        
                            <React.Fragment> { /* we need to use react fragment here to convert ( to string */ }

                                ( 
                                        
                                    {
                                        ( data.getChatRoom.limit  + '/' +  data.getChatRoom.members.length )     
                                    }

                                    <i style={{fontSize:10}} className="fas fa-user"/> 
                                    
                                )
                                        
                            </React.Fragment> }
                    
                    </span>


                </span>

                <ul style={{ padding:0,listStyle:"none" , width:"100%" , marginTop:30 }}>

                    {
                        data && data.getChatRoom.members.map((member,index)=>{

                            return (

                            <li style={{padding:5,width:"50%",display:"flex",fontSize:17.5,alignItems:"center"}} key={member._id} > 

                                {
                                    data.getChatRoom.host._id == member._id ? (
                                    
                                    <i className="fas fa-crown" style={{color:"#f0a500",fontSize:15}}/> 
                                    
                                    ) : (

                                    <i className="fas fa-user" style={{color:memberColors[index],fontSize:15}}/> )
                                }

                                <span style={{marginLeft:10}}> {member.username} </span>        
                                
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
                                        
                                        <InnerMessage key={index} checkOwner={ msg.owner._id == currentUser._id } > {/* row-reverse also reverses the end and start property */}

                                            <TextInformationBubble memberColor = {memberColors[

                                                data.getChatRoom.members.findIndex((m)=> m._id == msg.owner._id)

                                            ]} >

                                                <span> {msg.owner.username} </span>
                                                <span>  {msg.date} </span>

                                            </TextInformationBubble>
                                                                                                
                                            <TextBubble>  

                                                    {msg.text}

                                            </TextBubble>

                                            {
                                                    msg.owner._id == currentUser._id &&  (

                                                    <DeleteTextBubble onClick={OnDeleteMessage(msg._id)} >

                                                        <i style={{color:"#ec4646"}} className="fas fa-trash-alt"></i>
        
                                                    </DeleteTextBubble> )
                                            }
                                          

                                        </InnerMessage> 
                                        
                                    )
                                })
                        }

                     </Messages> }

                    <TextPart>

                            <ChatTextInput ref={ ref => chatText = ref }
                            
                             onKeyDown={(e)=>{

                                if(e.key == "Enter") { // we can use onKeyDown event to handle keyboard actions !
                                    OnSendMessage()
                                    e.target.value = ""
                                }

                             }}
                            
                            />

                            <Send onClick={OnSendMessage} > {

                                    Loading ? <img src="/spin.gif" width="30"/> : "SEND"

                            } </Send>

                    </TextPart>
                   

            </ChatBox>
        
    </GeneralWrapper>


}


export default Room;