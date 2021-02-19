const { gql } = require('apollo-server');
const  UserModel = require('../../../Models/ChatUserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerResolver = {

 Query: {

    loginUser: async (_,args,context)=>{

        const user = await UserModel.findOne({username:args.user.username});
        const token  = await jwt.sign( { username:user.username , email:user.email } , process.env.PRIVATE_KEY , {expiresIn:"1d"});

        if(user) {
            
            if ( user.password === args.user.password ) {

                return {...user,jwt:token};

            } else {

                throw new Error("User is Not Valid");

            }

        } else {

            throw new Error("User is Not Valid");
        }

    
     }
        
 },

 Mutation:{

     registerUser:async (parent, args, context)=>{

         const newUser = new UserModel({
                surname:args.user.surname,
                password:args.user.password,
                email:args.user.email
         })

         const saved = await newUser.save();

         return saved;

     }

 }

}

module.exports = registerResolver;