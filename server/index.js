//node server which will handle socket io
const io=require('socket.io')(3000);
const users={};
const antiusers={};
var users_names=[];
io.on("connection",socket=>{
    socket.on("new_user_joined",username =>{
        console.log("new user:",username);
        users[socket.id]=username;
        antiusers[username]=socket.id;
        console.log(users_names);
        io.sockets.to(socket.id).emit("get_user_list",users_names);
        if(username!=null){
            users_names.push(username);
        }
        socket.broadcast.emit("user_joined",username);
    });
    socket.on('send',(message,room)=>{
        console.log(message);
        if(room.length==0){
            socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
        }
        else{
            for(let i=0;i<room.length;i++){
                io.sockets.to(antiusers[room[i]]).emit('receive',{message:message,name:users[socket.id]});
            }
        }
    });
});