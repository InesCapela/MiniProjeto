var axios = require('axios');

function AddPerson(token, place){
	var data = JSON.stringify({"place":place});
	var config = {
		method: 'post',
		url: 'http://localhost:8080/socketio/add',
		headers: { 
		  'Authorization': 'Bearer ' + token
		},
		data: data
	};

	return axios(config);
}

function SubPerson(token, place){
	var data = JSON.stringify({"place":place});
	var config = {
		method: 'post',
		url: 'http://localhost:8080/socketio/sub',
		headers: { 
		  'Authorization': 'Bearer ' + token
		},
		data: data
	};

	return axios(config);
}

function ChangePlace(token, place){
	var data = JSON.stringify({"place":place});
	var config = {
		method: 'post',
		url: 'http://localhost:8080/socketio/change',
		headers: { 
		  'Authorization': 'Bearer ' + token
		},
		data: data
	};

	return axios(config);
}

function RemovePlace(token){
	var config = {
		method: 'post',
		url: 'http://localhost:8080/socketio/disconnected',
		headers: { 
		  'Authorization': 'Bearer ' + token
		}
	};

	return axios(config);
}

module.exports = { 
	AddPerson,
	SubPerson,
	ChangePlace,
	RemovePlace
 }
