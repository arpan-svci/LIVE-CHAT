const socket=io("http://localhost:3000");
const form=document.getElementById("send-container");
const messageInput=document.getElementById("messageInp");
const imageinput=document.getElementById("image");
const messageContainer=document.querySelector(".container");
const room_container=document.getElementById("room");
var userlist=[];
const append_img=(image,position)=>{
    console.log(image);
    const messageElement=document.createElement('img');
    messageElement.src=image;
    messageElement.classList.add('img');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}
const append_user=(username)=>{
    const userElement=document.createElement('input');
    userElement.type="checkbox";
    userElement.classList.add('user');
    userElement.id=username;
    room_container.append(userElement);
    room_container.append(username);
    var e=document.createElement('br');
    room_container.append(e);
}
form.addEventListener('submit',(e)=>{
    const message=messageInput.value;
    const image=imageinput.files[0];
    if(image!=null){
        var imageUrl=URL.createObjectURL(image);
    }
    message_send=[message,imageUrl];
    console.log(message_send);
    append(`you:${message}`,'right');
    if(image!=null){
        append_img(URL.createObjectURL(image),'right');
    }
    var room=[]
    var all=document.getElementById("all");
    if(all.checked==true){
        console.log("hello");
        socket.emit('send',message_send,room);
    }
    else{
        var user=document.querySelectorAll(".user");
        for(let i=0;i<user.length;i++){
            if(user[i].checked==true){
                room.push(user[i].id);
            }
        }
        console.log(room);
        socket.emit('send',message_send,room);
    }
    room=[];
    e.preventDefault();
});

var username=prompt("Enter your name:");
console.log(username)
var you=document.getElementById("you");
you.innerHTML=username;
socket.emit('new_user_joined',username);
socket.on("get_user_list",users_names=>{
    userlist=users_names;
    for(let i=0;i<users_names.length;i++){
        append_user(users_names[i]);
    }
});

socket.on('user_joined',data=>{
    console.log("hello");
    append(`${data} joined the chat`,'mid');
    append_user(data);
})
socket.on('receive',data=>{
    console.log("hello");
    append(`${data.name}:${data.message[0]}`,'left');
    if(data.message[1]!=null){
        console.log(data.message[1]);
        append_img(data.message[1],'left');
    }
})