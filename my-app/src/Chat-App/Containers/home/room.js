import React, {useEffect,useState} from 'react';
import { useQuery , useMutation } from '@apollo/client'
import { GET_CHAT_ROOM_QUERY } from '../../GraphqQL/Queries/ChatRoomQuery'
import {  
    
    SEND_MESSAGE_MUTATION , 
    MESSAGE,
    MEMBER_JOINED_ROOM,
    DELETE_MESSAGE_MUTATION , 
    LEAVE_ROOM_MUTATION ,
    UPDATE_MESSAGE_MUTATION
} from '../../GraphqQL/Mutations/CatchRoomMutation'

import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { valueFromAST } from 'graphql';


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

const EditTextBubble = styled.div`

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
 &:hover ${EditTextBubble}{
    margin-left:8px;
    width:auto;
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
const UpdateText = styled.input`

        outline: none;
        border-radius:7px;
        border:none;
        padding:5px;
        color:white;
        background:#007580;

`

const memberColors = [ "#025955 ", "#28527a", "DarkCyan", "DarkGoldenRod", "DarkBlue", "DarkRed", "DarkOrange", "Indigo" , "Purple" , "YellowGreen"];

const Room = ({match})=>{

    const { data , loading , error , subscribeToMore } = useQuery(GET_CHAT_ROOM_QUERY,{
        variables:{
            roomID:match.params.id
        },
    });
    const history = useHistory();

    const [isBeingUpdatedID,setIsBeingUpdatedID] = useState(false);

    const [ send , { loading:Loading } ] = useMutation(SEND_MESSAGE_MUTATION);

    const [ deleteMessage ] = useMutation(DELETE_MESSAGE_MUTATION);
    
    const [ updateMessage ] = useMutation(UPDATE_MESSAGE_MUTATION);

    const [ leaveRoom ] = useMutation(LEAVE_ROOM_MUTATION , {

        onCompleted:(data)=>{

            history.push('/main-page');

        }

    });

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

    const onLeaveRoom = ()=>{

        leaveRoom({
            variables:{
                roomID:match.params.id
            } 
        })

    }

    const OnDeleteMessage = (ID)=>{

            deleteMessage({
                variables:{
                    messageID:ID || null,
                    roomID:match.params.id || null
                }
            })

    }

    const onUpdateMessage = (ID,value)=>{

            updateMessage({

                variables:{
                    messageID:ID || null,
                    roomID:match.params.id || null,
                    updatedText:value || null
                }

            })

    }

    useEffect(()=>{ // we can handle user's status in room by using unmount function provided by useffect !

        return ()=>{

            onLeaveRoom();

        }

    },[])


    useEffect(()=>{

        subscribeToMore({
            variables:{
                roomID:match.params.id,
            },
            document:MESSAGE,
            updateQuery:(prev, { subscriptionData })=>{

                const subMessage = subscriptionData.data.message;
                const type = subscriptionData.data.message.actionType;
                
                switch(type) {

                    case 'SEND': 

                        setTimeout(()=>{ var chat = document.querySelector(".chatMessages"); chat.scrollTo(0, 7000); },0)

                        var updatedData = Object.assign({},prev.getChatRoom,{
                            messages:prev.getChatRoom.messages.concat(subMessage)
                        })  // message type must be the same shape as prevmessagetype
    
                    break;  

                    case 'DELETE':

                        var updatedData = Object.assign({},prev.getChatRoom,{
                            messages:prev.getChatRoom.messages.filter((msg)=> msg._id != subMessage._id )
                        })
        
                    break;


                    case 'UPDATE':

                        setIsBeingUpdatedID(null);

                        var updatedData = Object.assign({},prev.getChatRoom,{

                            messages:prev.getChatRoom.messages.map(
                            (msg)=> msg._id == subMessage._id ?  Object.assign({},msg,{text:subMessage.updatedText}) : msg )

                        })
 
                    break;

                    default:

                        var updatedData = prev.getChatRoom;

                    break;
                }
              
                return {
                    getChatRoom:updatedData  
                } 

            }
        })

        subscribeToMore({
            variables:{
                roomID:match.params.id
            },
            document:MEMBER_JOINED_ROOM,
            updateQuery:(prev,{subscriptionData})=>{

                const joinedMember = subscriptionData.data.room;        

                switch(joinedMember.actionType) {

                   case "JOIN":

                        var mergedData = Object.assign({},prev.getChatRoom,{
                            members:prev.getChatRoom.members.concat(joinedMember.user)
                        })

                   break;

                   case "LEAVE":

                        var mergedData = Object.assign({},prev.getChatRoom,{
                            members:prev.getChatRoom.members.filter((m)=> m._id != joinedMember.user._id )
                        })

                   break;

                   default:

                         var mergedData = prev.getChatRoom;

                    break;

                }
              

                return {
                    getChatRoom:mergedData
                }

            }
        })

    },[])

    var chatText;
 

    return <GeneralWrapper> 

            <LeaveGroup onClick={onLeaveRoom}>  
                    
                 LEAVE THE ROOM  <i style={{fontSize:14 , marginLeft:4}} className="fas fa-sign-out-alt"></i>

            </LeaveGroup>
            
            <Members>

                <span style={{color:"#ef4f4f",fontSize:13,fontWeight:"600",letterSpacing:1}}> 
                
                    GROUP MEMBERS 
                    
                    <span style={{marginLeft:5, fontWeight:600}}>
                        
                        { data &&  
                        
                            <React.Fragment> { /* we need to use react fragment here to convert ( to string */ }

                                ( 
                                        
                                    {
                                        ( data.getChatRoom.members.length + '/' +   data.getChatRoom.limit)     
                                    }

                                    <i style={{fontSize:10,marginLeft:2}} className="fas fa-user"/> 
                                    
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

                     { loading ? " Messages are loading...."  : <Messages className="chatMessages" >


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

                                                   {
                                                       isBeingUpdatedID ==  msg._id ? 
                                                     
                                                       ( <UpdateText 
                                                        
                                                            onKeyDown={(e)=>{

                                                                if(e.key == "Enter") { 

                                                                    onUpdateMessage( msg._id , e.target.value )
                                                                  
                                                                }   
                                                            }}

                                                             defaultValue = {msg.text} /> 
                                                        
                                                        ) : msg.text
                                                   } 

                                            </TextBubble>

                                            {
                                                    msg.owner._id == currentUser._id &&  (

                                                    <React.Fragment>

                                                            <EditTextBubble onClick={ ()=> OnDeleteMessage(msg._id) } >

                                                                <i style={{color:"#ec4646"}} className="fas fa-trash-alt"></i>
                
                                                            </EditTextBubble> 


                                                            <EditTextBubble  onClick={ ()=> setIsBeingUpdatedID(msg._id) } >

                                                                <i style={{color:"#ec4646"}} className="fas fa-edit"></i>
                
                                                            </EditTextBubble>


                                                            <EditTextBubble  onClick={ ()=> setIsBeingUpdatedID(msg._id) } >

                                                                <i style={{color:"#ec4646"}} className="fas fa-reply"></i>
                
                                                            </EditTextBubble>
                                                    
                                                    </React.Fragment>)
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