const { gql , withFilter , AuthenticationError , UserInputError , ForbiddenError , PubSub } = require('apollo-server');
const ChatRoom = require('../../../Models/ChatRoomModel');
const User = require('../../../Models/ChatUserModel');

const pubsub = new PubSub();

const chatRoomResolver = {
    
    Query:{

        getUserRooms:async (_, args , { user } )=>{

            if(!user) {
                throw new AuthenticationError("INVALID TOKEN");
            } else {
                const rooms = await ChatRoom.find({host:user._id})
                return rooms;
            }
        } , 

        getOtherRooms:async (_,args, { user })=>{

            if(!user) {
                throw new AuthenticationError("INVALID TOKEN");
            } else {

                const rooms = await ChatRoom.find({host:{$ne:user._id}})
                return rooms;
                
            }
        } ,


        getChatRoom:async (_,args, { user} )=>{

            if(!user) {
                throw new AuthenticationError("INVALID TOKEN");
            } else {

                const chatRoom = await ChatRoom.findById(args.roomID);
                console.log(chatRoom);
                return chatRoom;
                
            }
        
        }

    },

    Mutation:{

        createRoom: async (parent, { room } , { user } )=>{

            if(!user) {
                throw new AuthenticationError("INVALID TOKEN");
            } else {
                
                const newChatRoom = new ChatRoom({
                    ...room,
                    host:user._id,
                    memebers:[],
                    messages:[],
                })
      
                const createdRoom = await newChatRoom.save()
    
                return createdRoom;
            }

           
        } , 

        joinRoom: async (_, { roomID , memberLength , limit } , { user } )=>{
        
                if(!user) {

                   throw new AuthenticationError("INVALID TOKEN"); 

                } else {

                    if( memberLength < limit ) {

                        pubsub.publish('MEMBER_JOINED_ROOM',{
    
                            memberJoined:{
                                user,
                                roomID
                            }
                          
                        })    
    
                        const updated = await  ChatRoom.findOneAndUpdate( { _id:roomID } , {$push: { members: user._id } } );
    
                        return updated;
    
                    } else {
    
                        throw new ForbiddenError( " Member Limit is Reached !" );
                        
                    }

                }

        } ,


        sendMessage: async (_, { roomID , text } , { user } )=>{
      
            if(!user) {

                throw new AuthenticationError("INVALID TOKEN"); 

            } else {

                pubsub.publish( 'MESSAGE_SENT' , {

                    messageSent:{
                        text:text,
                        date:new Date(),
                        owner:user,
                        roomID
                    }

                })

                const updated = await ChatRoom.findOneAndUpdate( {_id:roomID} , {$push: { messages: { 

                    date:new Date(),
                    text,
                    owner:user._id

                }}})

                return updated;

            }

        }

    },
    Room:{

        host: async (parent)=>{

            const result = await User.findById(parent.host);
            return result

        },

        members: async (parent)=>{

            const result = await User.find( { _id: { $in: [...parent.members] } });
            return result
            
        },

    },

    Message:{

        owner: async (parent)=>{
            const result = await User.findById(parent.owner)
            return result;
        }

    },

    Subscription: {

        memberJoined: {
            
            subscribe: () => pubsub.asyncIterator(['MEMBER_JOINED_ROOM'])
            
        },

        messageSent: {

            subscribe: withFilter( 
            
            () => pubsub.asyncIterator('MESSAGE_SENT'),
            (payload,args)=>{

                return args.roomID ==  payload.messageSent.roomID

            })

        }
    }

}

module.exports = chatRoomResolver;