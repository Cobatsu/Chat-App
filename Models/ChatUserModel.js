const mongoose = require('mongoose');


const ChatUser = mongoose.Schema({

    userName:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    }


})

module.export = mongoose.model( 'ChatUser',ChatUser );