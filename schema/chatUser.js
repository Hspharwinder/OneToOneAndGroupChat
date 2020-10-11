var mongoose = require('mongoose');

var chatUser = new mongoose.Schema({
    userId: { type : String},
    userName: { type : String },
    userCreatedAt: { type: Date } 
});

mongoose.model('chatUser', chatUser);