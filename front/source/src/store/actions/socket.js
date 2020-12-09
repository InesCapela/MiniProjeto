
import socketIOClient from "socket.io-client";

function connect(){
	return socketIOClient(api.URL_SOCKETIO, {
		withCredentials: true,
		transportOptions: {},
		reconnection: true,
		reconnectionDelay: 3000,
		reconnectionDelayMax : 5000,
		reconnectionAttempts: 5
	})
}

function emit(){
	
}