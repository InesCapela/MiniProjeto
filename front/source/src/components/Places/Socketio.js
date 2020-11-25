import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://172.31.0.3:8080/";

function Socketio() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default Socketio;