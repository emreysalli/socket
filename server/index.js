const express= require("express");
const app=express();
const http=require("http");
const {Server}=require("socket.io");
const cors=require("cors");

app.use(cors());
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room",(data,callback)=>{
        socket.join(data);
        callback(`Joined ${data}`);
    })

    socket.on("send_message",(data)=>{
        // console.log(data);
        // socket.broadcast.emit("receive_message",data);
        socket.to(data.roomNum).emit("receive_message",data); //aynı odadaki diger clientlara mesaj gonder
    });

    socket.on("broadcast",(data)=>{
        socket.broadcast.emit("receive_message",data); // gecerli client haric diger butun clientlara gonderir
        // io.emit("receive_message",data); //butun clientlara gonderir
    });

});

server.listen(3001,()=>{
    console.log("Server is running");
});
