import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import * as api from "../../store/actions/api"

function Socketio() {

  const socket = socketIOClient(api.URL_SOCKETIO, {
    withCredentials: true, transportOptions: {}
  });

  const [response, setResponse] = useState("");

  useEffect(() => {
    // After connect send token
    socket.on("connect", () => {
      socket.emit("set-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImluZXMiLCJpc0FkbWluIjpmYWxzZSwiZXhwIjoxNjA2MzI0MzAzfQ.7VubRIltC3VraNl_abE7RLyNkmv5YsPfSN-WnwMslgU")

      socket.emit("add-people", "")
    })
  }, [socket]);

    


  return (
    <p>
      It's <b id={response}>{response}</b>
    </p>
  );
}

export default Socketio;