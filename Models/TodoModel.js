const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({

    title:String,
    description:String

})

module.exports = mongoose.model( 'todo', TodoSchema);