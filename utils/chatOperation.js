const mongoose = require('mongoose');
const realTimeChat = mongoose.model('message');

// get chat detail
const allChats = (req, res) => {
    realTimeChat.aggregate([
        { $sort : { messageTime : -1 } },
        
        {
            $lookup: 
            {
                from: "chatgroups", 
                localField: "groupId", 
                foreignField: "groupId",
                as: "groupAndMessage"
            }
        },
        {// code for get sub doc as root
          $replaceRoot: { 
                   newRoot: { 
                       $mergeObjects: [ { $arrayElemAt: [ "$groupAndMessage", 0 ] }, "$$ROOT" ]
                   } 
              }
        },
        {
            $lookup: 
            {
                from: "chatusers", 
                localField: "userId", 
                foreignField: "userId",
                as: "userAndMessage"
            }
        },
        { // code for get sub doc as root
          $replaceRoot: { 
                   newRoot: { 
                       $mergeObjects: [ { $arrayElemAt: [ "$userAndMessage", 0 ] }, "$$ROOT" ]
                   } 
              }
        },      
        { $project: { 
                _id: 0, 
                userName:1, 
                message:1, 
                groupName:1
            } 
        },
        { $limit : 1 },
     ]).then(result=>{
        let response;
        response = result[0];
        response['userName_groupName'] = (response.groupName)? (response.groupName):(response.userName);
        delete response['groupName']; // Delete old key 
        delete response['userName']; // Delete old key 
        response['lastMessage'] = response['message']; // Assign new key
        delete response['message']; // Delete old key 
        realTimeChat.find({unreadMessage:true}).countDocuments().then(result2=>{
            response.unreadMessageCount = result2;
            if (result.length == 0) return res.status(200).json([{ success: "Not present" }]);

            return res.status(200).json([result[0]]);
        })               
    }).catch(err=>{
        res.status(200).json([{ success: "Fail to retirve record", error: err }])
    })
   
}

// creating chat in DB
const insertChat = (req, res) => {
    // Set values of Chat
    let chat = new realTimeChat(req.body);
    // save chat into DB
    chat.save().then(result => {
        if (result.length != 0) {
            // return res.status(200).json([{ message: 'row inserted' }])
        }else{
            console.log("No row affected in DB");
            // return res.status(200).json([{ message: 'No row affected in DB', error: err }])
        }
        // res.status(201).json({ message: "Record inserted Successfully" });
    }).catch(err => {
        console.log("Error While Insertion ", err);
        // res.status(500).json({ error: "Error While Insertion " + err });
    }); 
};

const updateUnreadMessage = (req, res) => {
    realTimeChat.updateMany({ unreadMessage:true, groupId:req.body.groupId }, {$set: { unreadMessage:false }}).then(result => {
        if (result.length != 0) {
            console.log(result[0]);
            // return res.status(200).json([{ message: 'row inserted' }])
        }else{
            console.log("No row affected in DB");
            // return res.status(200).json([{ message: 'No row affected in DB', error: err }])
        }
        // res.status(201).json({ message: "Record inserted Successfully" });
    }).catch(err => {
        console.log("Error While Insertion ", err);
        // res.status(500).json({ error: "Error While Insertion " + err });
    }); 
}

module.exports = {
    allChats,
    insertChat,
    updateUnreadMessage,
}