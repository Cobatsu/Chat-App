const { gql , withFilter , AuthenticationError , UserInputError , ForbiddenError , PubSub } = require('apollo-server');
const ChatRoom = require('../../../Models/ChatRoomModel');

const pubsub = new PubSub();

const chatRoomResolver = {

    Mutation:{

        createRoom: async (parent, { room } , { user } )=>{

            const newChatRoom = new ChatRoom({
                ...room,
                host:user._id,
                memebers:[],
            })

            pubsub.publish('ROOM_CREATED',{
                roomCreated:{
                    ...room,
                    host:user._id
                }       
            })

            const createdRoom = await newChatRoom.save()

            return createdRoom;
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
        }
    },
    
    Subscription: {
        roomCreated: {
           subscribe:withFilter(
               () => pubsub.asyncIterator(['ROOM_CREATED']) , 
               ( payload,_,{ user } )=>  {

                    return  payload.roomCreated.host != user._id

                })
        }
    }

}

module.exports = chatRoomResolver;