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
			//users.get(token).disconnect();
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
		console.log(`${id}: last place - ${socket.place}`)
		
		if(socket.place == null)
			socket.place = "undefined"

		var post = api.RemovePlace(socket.token, socket.place);
		post.then((response) => {
			var data = response.data
			console.log(data)
			
			io.emit("update-place-list", {
				responseID: responseID,
				placeID: data.placeID,
				placeName: data.placeName, 
				users: data.users
			});
			
		})
		.catch(function (error) {
			console.log("Users was not on any place (probably)");
		});
	});


	//////////////////////////////
	// User change place
	socket.on("change-place", msg => {
		console.log(`${id}: change place from ${socket.place} to: ${msg}`);

		if(socket.place == null)
			socket.place = "undefined"

		var post1 = api.RemovePlace(socket.token, socket.place);
		post1.then((response) => {
			var data = response.data
			console.log(data)
			socket.lastPlace = socket.place;

			io.emit("update-place-list", {
				responseID: responseID,
				placeID: data.placeID,
				placeName: data.placeName, 
				users: data.users
			});
			
		}).catch((error) => console.log("ERROR: leave old place"));

		var post = api.ChangePlace(socket.token, msg);
		post.then((response) => {
			var data = response.data
			console.log(data)

			socket.lastPlace = socket.place;
			socket.place = msg;

			io.emit("update-place-list", {
				responseID: responseID,
				placeID: data.placeID,
				placeName: data.placeName, 
				users: data.users
			});

		})
		.catch((error) => console.log("ERROR: change new place"));

		responseID++;
	});


	//////////////////////////////
	// Add person to a place
	socket.on("add-people", async (msg) => {
		console.log(`${id}: added one person to: ${socket.place}`);

		if(socket.place === undefined)
			return

		var post = api.AddPerson(socket.token, socket.place);
		await post.then((response) => {
			var data = response.data
			console.log(data)
			
			io.emit('update-place-number', {
				responseID: responseID,
				placeID: data.placeID,
				placeName: data.placeName, 
				numUsers: data.people
			});

		})
		.catch(function (error) {
			console.log("ERROR: add people");
		});

		responseID++;
	});


	//////////////////////////////
	// Sub person to a place
	socket.on("sub-people", msg => {


		if(socket.place === undefined)
			return

		console.log(`${id}: removed one person to: ${socket.place}`);

		var post = api.SubPerson(socket.token, socket.place);
		post.then((response) => {
			var data = response.data
			console.log(data)

			io.emit('update-place-number', {
				responseID: responseID,
				placeID: data.placeID,
				placeName: data.placeName, 
				numUsers: data.people
			});
		})
		.catch(function (error) {
			console.log("ERROR: sub people");
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