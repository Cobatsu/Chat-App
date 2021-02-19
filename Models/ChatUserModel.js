const mongoose = require('mongoose');


const ChatUser = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model( 'ChatUser', ChatUser );