const mongoose = require('mongoose');
const chatUser = mongoose.model('chatUser');

// creating chat in DB
const addUser = (req, res) => {
    // Set values of Chat
    let user = new chatUser(req.body);
    // save chat into DB
    user.save().then(result => {
        console.log(result);
        if (result.length != 0) {
            console.log('record inserted');
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

const getUser = (req, res) => {
    chatUser.find().then(result => {
        if (result.length != 0) {
            console.log('record Retrived');
            return res.status(200).json(result)
        }else{
            console.log("No record found");
            return res.status(200).json([{ message: 'No record found' }])
        }
    }).catch(err => {
        console.log("Fail to get record ", err);
        res.status(500).json({ error: "Fail to get record" + err });
    }); 
}

module.exports = {
    addUser,
    getUser
}