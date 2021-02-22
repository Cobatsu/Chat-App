const { gql , AuthenticationError , UserInputError , ForbiddenError } = require('apollo-server');
const  UserModel = require('../../../Models/ChatUserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const accountResolver = {

 Query: {

    checkToken: async (_,args,{user})=>{

        if(!user) {
            throw new AuthenticationError("INVALID TOKEN");
        } else {
            let currentUser = await UserModel.findById(user._id);
            return currentUser;
        }

    },
    
    loginUser: async ( _,args,context )=>{
        
        const user = await UserModel.findOne({username:args.user.username});

        if(user) {
            
            if ( user.password === args.user.password ) {

                const token  = await jwt.sign( { username:user.username , email:user.email , _id:user._id } , process.env.PRIVATE_KEY , {expiresIn:"1d"});

                return { ...user._doc , jwt:token }

            } else {

                throw new UserInputError("Username or Password is Incorrect !");

            }

        } else {

            throw new UserInputError("Username or Password is Incorrect !");
        }

     }
        
 },

 Mutation:{

     registerUser:async (parent, args, context)=>{

         const newUser = new UserModel({
                username:args.user.username,
                password:args.user.password,
                email:args.user.email
         })

         const saved = await newUser.save();

         return saved;

     }

 }

}

module.exports = accountResolver;