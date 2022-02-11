const socket=io("http://localhost:3000");
const form=document.getElementById("send-container");
const messageInput=document.getElementById("messageInp");
const imageinput=document.getElementById("image");
const messageContainer=document.querySelector(".container");
const room_container=document.getElementById("room");
var userlist=[];
const delete_element=(id)=>{
    var element=document.getElementsByClassName(id)[0];
    element.remove();
}
const append_img=(image,position)=>{
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
    const final=document.createElement('div');
    final.classList.add(username);
    const userElement=document.createElement('input');
    const text=document.createElement('label');
    userElement.type="checkbox";
    userElement.classList.add('user');
    userElement.id=username;
    text.innerText=username;
    final.append(userElement);
    final.append(text);
    // var e=document.createElement('br');
    // final.append(e);
    room_container.append(final);
}
form.addEventListener('submit',(e)=>{
    const message=messageInput.value;
    const image=imageinput.files[0];
    if(image!=null){
        var imageUrl=URL.createObjectURL(image);
    }
    message_send=[message,imageUrl];
    append(`you:${message}`,'right');
    if(image!=null){
        append_img(URL.createObjectURL(image),'right');
    }
    var room=[]
    var all=document.getElementById("all");
    if(all.checked==true){
        socket.emit('send',message_send,room);
    }
    else{
        var user=document.querySelectorAll(".user");
        for(let i=0;i<user.length;i++){
            if(user[i].checked==true){
                room.push(user[i].id);
            }
        }
        socket.emit('send',message_send,room);
    }
    room=[];
    e.preventDefault();
});

var username=prompt("Enter your name:");
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
    append(`${data} joined the chat`,'mid');
    append_user(data);
})
socket.on('receive',data=>{
    append(`${data.name}:${data.message[0]}`,'left');
    if(data.message[1]!=null){
        append_img(data.message[1],'left');
    }
})
socket.on('user_disconnected',(username)=>{
    delete_element(username);
    append(`${username} left the chat`,'left');
})