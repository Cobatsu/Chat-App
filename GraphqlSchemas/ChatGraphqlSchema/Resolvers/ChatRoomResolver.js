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

                    memberJoined:{
                        user,
                        roomID
                    }
                  
                })

                const joinedRoom = await ChatRoom.findOne({_id:roomID});

                if( joinedRoom.members.length < joinedRoom.limit ) {

                    const updated = await  ChatRoom.findOneAndUpdate( { _id:roomID } , {$push: { members: user._id } } );

                    return updated;

                } else {

                    throw new ForbiddenError( " Member Limit is Reached ! " );
                    
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
            
            subscribe: () => pubsub.asyncIterator(['MEMBER_JOINED_ROOM'])
        
        }
    }

}

module.exports = chatRoomResolver;