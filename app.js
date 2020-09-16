var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = [];
var currentTurn = 1;
var turn = 0;

// Get index file and other required external javascript/css function files
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/js/client.js', (req, res) => {
	res.sendFile(__dirname + '/js/client.js');
});
app.get('/js/socketClient.js', (req, res) => {
	res.sendFile(__dirname + '/js/socketClient.js');
});
app.get('/js/pageActions.js', (req, res) => {
	res.sendFile(__dirname + '/js/pageActions.js');
});
app.get('/js/constants.js', (req, res) => {
	res.sendFile(__dirname + '/js/constants.js');
});
app.get('/css/style.css', (req, res) => {
	res.sendFile(__dirname + '/css/style.css');
});


// Handle the server-side connections
io.on('connection', (socket) => {
	users.push(socket);
	console.log('a user connected');
	io.sockets.emit('updateTableUsers', users.length);
	// when a client disconnects from the server
	socket.on('disconnect', () => {
		//users.splice(users.indexOf(socket.id), 1);
		users.splice(users.indexOf(socket), 1);
		io.sockets.emit('updateTableUsers', users.length);
		console.log('user disconnected');
	});
	
	// when a client sends a card to the server, put it on the table NEED TO IMPLEMENT ON TABLE NEXT
	socket.on('sentCard', (card) => {
		console.log("Recieved card from " + socket.id);
		console.log(card);
		socket.emit('sentCardSuccess');
	});
	
	// When a client wants another card for their hand, send them the CONTENT
	socket.on('requestedCard', () => {
		console.log(socket.id + " wants a card");
		socket.emit('requestedCard', Math.floor(Math.random()*100000)); // put csv file load-in here
		console.log("Gave them a Card");
	});
	
	socket.on('passTurn', () => {
		if(users[turn] == socket) {
			users[(turn+1)%users.length].emit('yourTurn');
			passTurn(socket);
		}
	});
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});


function passTurn(socket) {
	turn = currentTurn++ % users.length;
	console.log("next turn triggered");
}
