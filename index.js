const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
require('./database/connection');
const chatOperation = require('./utils/chatOperation');
const userOperation = require('./utils/userOperation');
const groupOperation = require('./utils/groupOperation');
const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(bodyParser.json()); // parse the body data in json format post by http 
app.use(bodyParser.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord HSP';
let unreadMessage = true;
let groupId = null;
let chatTypeGroup = false;
let addUser = true;

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.use('/', require('./routes/endPoints'));

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      chatTypeGroup = true; 
      const user = userJoin(socket.id, username, room, new Date(), new Date());
       
      creatingRoom(user, room, botName);  
      const groupMember = getRoomUsers(room);
      if(groupMember.length == 1){
        groupId = uuidv4();
        const groupDetail = {
          groupId: groupId,
          groupName: room,
          groupCreatedAt: user.groupCreatedAt
        }
        // add group in db
        groupOperation.addGroup({ body: groupDetail });
      }
    
    });
  
    socket.on('oneToOne',  ({ username, room, usernameTwo }) => {
      chatTypeGroup = false; 
      const newRoom = room ? room: username + usernameTwo;      
      const user = userJoin(socket.id, username, newRoom, new Date(), new Date());
      creatingRoom(user, newRoom, botName);         
      if(room) {
        socket.emit('removeButton');
        addUser= false;
      }else addUser = true;    
    });

    const creatingRoom = (user, newRoom, botName) =>{
      
      const groupMember = getRoomUsers(newRoom);
      unreadMessage = (groupMember.length > 1) ? false:true;
      
      socket.join(newRoom);
      if(addUser){
        const userDetail = {
          userId: user.id,
          userName: user.username,
          userCreatedAt: user.userCreatedAt
        }
        // add user in db
        userOperation.addUser({ body: userDetail });
      }
      
       // Welcome current user
       socket.emit('message', formatMessage(botName, 'Welcome to HSP ChatCord!'));

       if(addUser){
        // Broadcast when a user connects
          socket.broadcast
          .to(newRoom)
          .emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
          );

          // Send users and room info
        io.to(newRoom).emit('roomUsers', {
          room: newRoom,
          users: getRoomUsers(user.room)
        });
       }       
    }

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      let user = getCurrentUser(socket.id);
      const groupIdStore = chatTypeGroup ? groupId : null;  
      const postMsg = { 
        messageId: uuidv4(),
        message: msg,
        unreadMessage: unreadMessage,
        messageTime: new Date(),
        userId: user.id,
        groupId: groupIdStore,
       };
       // add chat in db
      chatOperation.insertChat({ body: postMsg });
      if(!unreadMessage) chatOperation.updateUnreadMessage({ body: postMsg });

      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      const groupMember = getRoomUsers(user.room);
      unreadMessage = (groupMember.length > 1) ? false:true;
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });
  
  const PORT = process.env.PORT || 3000;
  
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));