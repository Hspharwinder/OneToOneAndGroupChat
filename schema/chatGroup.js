var mongoose = require('mongoose');

var chatGroup = new mongoose.Schema({
    groupId: { type: String },
    groupName: { type : String },
    groupCreatedAt: { type: Date }
});

mongoose.model('chatGroup', chatGroup);