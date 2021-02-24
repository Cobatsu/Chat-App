import React , {useState} from 'react';
import styled from 'styled-components';
import { useSelector , useDispatch } from 'react-redux';
import {  useHistory } from 'react-router-dom'
import UserRooms from './userRooms'
import OtherRooms from './otherrooms'
import { logout } from '../../Actions/action'// import RoomQuery from './roomQuery'
import { useMutation } from '@apollo/client'
import { CREATE_ROOM_MUTATION  } from '../../GraphqQL/Mutations/CatchRoomMutation'

const GeneralWrapper = styled.div`
    display:flex;
    justify-content:space-around;
    align-items:center;
    height:100%;
    width:88%;
    margin:0 auto;
`

const InnerDiv = styled.div`

    height:500px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    flex:0.75;
    display:flex;
    justify-content:space-evenly;
    align-items:center;
    box-sizing: border-box;
    padding:10px;
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
    width:70%;
`
const Innerbuttons = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    width:100%;
    margin-top:30px;

`

const Profile = styled.div`

    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    height:500px;
    flex:0.20;
    display:flex;
    flex-direction:column;
    border-radius:8px;
    align-items:center; 

`
const TextSpan = styled.span`
    font-size:13px;
    margin:3px;
`
const Button = styled.button`
        border:none;
        padding:10px;
        width:100%;
        margin-top:15px;
        display:flex;
        justify-content:space-around;
        cursor:pointer;
        &:hover{
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
        }
`
const InnerInputWrapper = styled.div`

display:flex;
flex-direction:column;
width:80%;
font-size:14px;
margin-top:20px;

`

const MainPage = ( props )=>{

    const currentUser = useSelector(( state = {} ) => state.user || {} );

    const [ create , { loading , error } ] = useMutation(CREATE_ROOM_MUTATION , {
        onError:(error)=>{ console.log(error) }
    });
    
    const dispatch = useDispatch();
    const history = useHistory();
    const storeError = useSelector( ( state = {} ) => state.error);
    const [ timeToRefetch , setTimeToRefetch ] = useState(false);

    let limit , title;

    const onLogout = ()=>{

        localStorage.removeItem('token');
        dispatch( logout() );
        history.push("/login");

    }

    const createRoom = ()=>{

        create({
            variables:{
                room:{
                    title: title.value.toLowerCase() || null,
                    limit: parseInt( limit.value ) || null
                }
            }
        }).then(()=>{
                    setTimeToRefetch(true);
        })

    }

    return   <React.Fragment>

          { error &&  storeError.errorType + " " + storeError.message}  
          
        <GeneralWrapper> 

         <LogOut onClick={ onLogout } >
             LOG OUT
         </LogOut>

         <Profile>
            
            <img src="/userpng.png" width="60%" style={{marginBottom:20 , marginTop:20}}/>

            <UserInformation>

                  <TextSpan> username : {currentUser.username} </TextSpan>
                  <TextSpan> email : {currentUser.email} </TextSpan>  

            </UserInformation>


            <Innerbuttons >
                            
                    <InnerInputWrapper>

                                <div style={{display:'flex', justifyContent:'space-between',width:'100%'}}>  

                                    <span > Title :</span> 
                                    <input ref={ref=>title=ref} style={{width:'50%'}} placeholder="title"/>

                                </div>

                                <div style={{display:'flex', marginTop:6, justifyContent:'space-between',width:'100%'}}>   

                                    <span>Max People :</span> 

                                    <select style={{width:'100px'}} ref={ref=>limit=ref}>
                                                {
                                                    Array(10).fill().map((_,index)=> <option key={index} > {index+1} </option>)
                                                }
                                    </select>

                                </div>
                             
                                <Button onClick={createRoom}> Createa Room  <i className="fas fa-plus"></i> </Button>
                    </InnerInputWrapper>

                    <InnerInputWrapper>

                         
                            <input style={{width:'100%'}} placeholder="Search..."/>

                            <Button onClick={createRoom}> Search Room  <i className="fas fa-search"></i> </Button>

                    </InnerInputWrapper>

            </Innerbuttons>
        
         </Profile>

              
         <InnerDiv>        
                                 
                  <UserRooms timeToRefetch = {timeToRefetch}  setTimeToRefetch = {setTimeToRefetch}/>
                  <OtherRooms/>
                  
         </InnerDiv>
    
    </GeneralWrapper>

     </React.Fragment>

}


export default MainPage;