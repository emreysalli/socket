import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";

const socket=io.connect("http://localhost:3001");
// const socket=io.connect("wss://socketsbay.com/wss/v2/2/demo/");



function App() {
  const [socketId,setSocketId]=useState("");
  const [roomNum,setRoomNum]=useState("");

  const [message,setMessage]=useState("");
  const [messageReceived,setMessageReceived]=useState("");

  socket.on("connect",()=>{
    setSocketId(socket.id);
    console.log(`Socket connected: ${socket.connected}`);
    console.log(`Socket disconnected: ${socket.disconnected}`);

    // const engine=socket.io.engine;
    // console.log(engine.transport.name);
    // engine.once("upgrade", () => {
    //   // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    //   console.log(engine.transport.name); // in most cases, prints "websocket"
    // });
  });

  const joinRoom=()=>{
    if(roomNum!==""){
      socket.emit("join_room",roomNum,returnMsg=>{
        alert(returnMsg);
      });
    }
  };

  const leaveRoom=()=>{
    let id=socket.id;
    socket.emit("leave_room",{id,roomNum},returnMsg=>{
      alert(returnMsg);
    });
  };

  const sendMessage=()=>{
     socket.emit("send_message",{message,roomNum});
  };

  const broadcast=()=>{
    socket.emit("broadcast",{message});
  };

  const socketOpen=()=>{
    socket.connect();
    
    setTimeout(() => {
      alert(`Socket open ${socket.connected}`)
    }, 500);

  }

  const socketClose=()=>{
    socket.close();
    alert(`Socket close ${socket.disconnected}`);
  }

  // socket.timeout(5000).emit("send_message",{message,roomNum});
  socket.onAny((event, ...args) => {
    console.log(`got ${event}`);
  });

  socket.on("connect_error", (error) => {
    console.log(`Connect error: ${error}`);
  });

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
        <button onClick={leaveRoom}>leave room</button>
      </div>
      <input placeholder="Message" onChange={(event)=>{setMessage(event.target.value)}}/>
      <button onClick={sendMessage}>Send</button>
      <button onClick={broadcast}>Broadcast</button>
      <button onClick={socketOpen}>Socket Open</button>
      <button onClick={socketClose}>Socket Close</button>
      <h3>Socket id:</h3>
      {socketId}
      <h1>Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App;
