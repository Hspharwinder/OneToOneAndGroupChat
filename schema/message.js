var mongoose = require('mongoose');

var message = new mongoose.Schema({
    messageId: { type: String}, 
    message: { type : String },    
    unreadMessage: { type: Boolean },
    messageTime: { type: Date },
    userId: { type: String },
    groupId: { type: String }
});

mongoose.model('message', message);