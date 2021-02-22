const { gql , withFilter , AuthenticationError , UserInputError , ForbiddenError , PubSub } = require('apollo-server');
const ChatRoom = require('../../../Models/ChatRoomModel');
const User = require('../../../Models/ChatUserModel');

const pubsub = new PubSub();

const chatRoomResolver = {

    Mutation:{

        createRoom: async (parent, { room } , { user } )=>{

            if(!user) {
                throw new AuthenticationError("INVALID TOKEN");
            } else {
                
                const newChatRoom = new ChatRoom({
                    ...room,
                    host:user._id,
                    memebers:[],
                })
      
                const createdRoom = await newChatRoom.save()
    
                return createdRoom;
            }

           
        } , 

        joinRoom: async (_, { roomID } , { user } )=>{


                pubsub.publish('MEMBER_JOINED_ROOM',{
                    ...user,
                    roomID
                })

                const updated = await  ChatRoom.findOneAndUpdate( { _id:roomID } , {$push: { members: user._id } } );

                return updated;
        }

    },
    Room:{

        host:async (parent,args, { user })=>{

            const result = await User.findById(parent.host);

            return result

        }

    },
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
        }
    },
    
    Subscription: {
        memberJoined: {
           subscribe:withFilter( 
            () => pubsub.asyncIterator(['MEMBER_JOINED_ROOM']) ,  
            (payload,{roomID})=> { 

                return roomID == payload.roomID

            })
        
        }
    }

}

module.exports = chatRoomResolver;