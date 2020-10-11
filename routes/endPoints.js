
const router = require('express-promise-router')();
// const chat = require('../utils/chatOperation');

router.get('/chat', chat.allChats);
// router.post('/postChat', chat.insertChat);

module.exports = router;