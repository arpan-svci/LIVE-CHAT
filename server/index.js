//node server which will handle socket io
const io=require('socket.io')(3000);
var users={};
var antiusers={};
var users_names=[];
io.on("connection",socket=>{
    socket.on("new_user_joined",username =>{
        users[socket.id]=username;
        antiusers[username]=socket.id;
        io.sockets.to(socket.id).emit("get_user_list",users_names);
        if(username!=null){
            users_names.push(username);
        }
        socket.broadcast.emit("user_joined",username);
    });
    socket.on('send',(message,room)=>{
        if(room.length==0){
            socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
        }
        else{
            for(let i=0;i<room.length;i++){
                io.sockets.to(antiusers[room[i]]).emit('receive',{message:message,name:users[socket.id]});
            }
        }
    });
    socket.on("disconnect",()=>{
        var temp=users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('user_disconnected',temp);
        delete antiusers[temp];
        var t=[];
        for(var i=0;i<users_names.length;i++){
            if(users_names[i]!=temp){
                t.push(users_names[i]);
            }
        }
        users_names=t;
    });
});