const api = require('./api')

const server = require('http').createServer();
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true
	}
});

const users = new Map();
var responseID = 0;

//////////////////////////////
// New user connected
io.on("connection", socket => {
	const {id} = socket.client;
	console.log(`User connected: ${id}`);
	var token = socket.handshake.headers['token'];

	//////////////////////////////
	// Auth token
	if(token != null){

		// Already exists a socket associated to this user.
		if(users.has(token)){
			users.get(token).disconnect();
			users.delete(token);
		}

		users.set(token, socket)
		socket.token = token;
	} else {
		console.log(`Removing: ${id}. Invalid token`);
		//socket.disconnect();
	}


	//////////////////////////////
	// User left
	socket.on('disconnect', () => {
		console.log(`User disconnected: ${id}`);

		if(socket.place != undefined) {
			console.log(`${id}: last place - ${socket.place}`)

			var post = api.RemovePlace(socket.token);
			post.then((response) => {
				var data = response.data
				console.log(data)
				// TODO: Avisar oldplace!
			})
			.catch(function (error) {
				console.log(error);
			});
		}
	});


	//////////////////////////////
	// User change place
	socket.on("change-place", msg => {
		console.log(`${id}: change place from ${socket.place} to: ${msg}`);

		if(socket.place != null){
			var post = api.RemovePlace(socket.token, socket.place);
			post.then((response) => {
				socket.lastPlace = socket.place;
			}).catch((error) => console.log(error));

		}

		var post = api.ChangePlace(socket.token, msg);
		post.then((response) => {
			var data = response.data
			console.log(data)

			socket.lastPlace = socket.place;
			socket.place = msg;

			// Avisar oldPlace
			//
			// Avisar newPlace
			//
		})
		.catch((error) => console.log(error));

		responseID++;
	});


	//////////////////////////////
	// Add person to a place
	socket.on("add-people", async (msg) => {
		console.log(`${id}: added one person to: ${socket.place}`);

		if(socket.place === undefined){
			// GET PLACE AGAIN
			return
		}

		var post = api.AddPerson(socket.token, socket.place);
		await post.then((response) => {
			var data = response.data
			console.log(data)

			socket.broadcast.emit('update-place', {
				responseID: responseID,
				place: data.place,
				numUsers: data.people
			});
		})
		.catch(function (error) {
			console.log(error);
		});

		responseID++;
	});


	//////////////////////////////
	// Sub person to a place
	socket.on("sub-people", msg => {
		console.log(`${id}: removed one person to: ${socket.place}`);

		var post = api.SubPerson(socket.token, socket.place);
		post.then((response) => {
			var data = response.data
			console.log(data)

			socket.broadcast.emit('update-place', {
				id: responseID,
				place: data.place,
				numUsers: data.people
			});
		})
		.catch(function (error) {
			console.log(error);
		});

		responseID++;
	});
});


const PORT = 8081;
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));






	/*
		users.forEach((value, key, map) => {
			value.emit("update-place", {
				id: responseID,
				place: data.place,
				numUsers: data.people
			})
		})
	*/