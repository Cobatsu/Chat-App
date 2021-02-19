const { gql } = require('apollo-server');
const  UserModel = require('../../../Models/ChatUserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerResolver = {

 Query: {

    loginUser: async (_,args,context)=>{

        const user = await UserModel.findOne({username:args.user.username});

        console.log(user);

        if(user) {
            
            if ( user.password === args.user.password ) {

                const token  = await jwt.sign( { username:user.username , email:user.email } , process.env.PRIVATE_KEY , {expiresIn:"1d"});

                return { ...user._doc , jwt:token }

            } else {

                throw new Error("Username or Password is Incorrect !");

            }

        } else {

            throw new Error("Username or Password is Incorrect !");
        }

     }
        
 },

 Mutation:{

     registerUser:async (parent, args, context)=>{

         console.log(args,"alikjdhaksd");

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

module.exports = registerResolver;