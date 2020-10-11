const mongoose = require('mongoose');
const chatGroup = mongoose.model('chatGroup');

// creating chat in DB
const addGroup = (req, res) => {
    // Set values of Chat
    let group = new chatGroup(req.body);
    // save chat into DB
    group.save().then(result => {
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

const getGroup = (req, res) => {
    chatGroup.find().then(result => {
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
    addGroup,
    getGroup
}