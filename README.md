## Start project
1. npm i
2. node index.js

### 1. For one to one chat visit http://localhost:3000/loginUser.html 

### 2. Group Chat
for group chat interface vist - http://localhost:3000/groupChat.html
1. In chat interface enter username
2. and click on join
3. for join group as second user-  visit again http://localhost:3000/groupChat.html (open new tab)
4. enter new user name
5. send message
NOTE: you would get message in both interfaces

### 3. http://localhost:3000/chat
For get the last message of every chat, username/group name, unread message count

# Database structure would be like

#### Table 1 - User (my collection name as chatusers)
Feilds ---> userId,    userName,    userCreatedAt

#### Table 2 - Group (my collection name as chatgroups)
Feilds --->  groupId,  groupName,    groupCreatedAt

#### Table 3 - Message (my collection name as messages)
Feilds ---> messageId,  message,  messageTime,  userId,   groupId


# Build A Group-Chat App in 30 Lines Using Node.js

A simple and (hopefully) to-the-point tutorial to build your first group-chat application using Node.js in less than 30 lines of code.

## Running the program

Run the program by using

```shell
$ node index.js
```