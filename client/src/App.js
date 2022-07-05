import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";

const socket=io.connect("http://localhost:3001");
// const socket=io.connect("wss://socketsbay.com/wss/v2/2/demo/");



function App() {

  const [roomNum,setRoomNum]=useState("");

  const [message,setMessage]=useState("");
  const [messageReceived,setMessageReceived]=useState("");

  const joinRoom=()=>{
    if(roomNum!==""){
      socket.emit("join_room",roomNum);
    }
  };

  const sendMessage=()=>{
     socket.emit("send_message",{message,roomNum});
  };

  useEffect(()=>{
    socket.on("receive_message",(data)=>{
      // alert(data.message);
      setMessageReceived(data.message);
    });
  },[socket]);
  return (
    <div className="App">
      <div style={{marginBottom:20}}>
        <input placeholder='room number' onChange={(event)=>{setRoomNum(event.target.value)}}/>
        <button onClick={joinRoom}>join room</button>
      </div>
      <input placeholder="Message" onChange={(event)=>{setMessage(event.target.value)}}/>
      <button onClick={sendMessage}>Send</button>
      <h1>Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App;
