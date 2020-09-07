var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

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

app.get('/css/style.css', (req, res) => {
	res.sendFile(__dirname + '/css/style.css');
});


// Handle the server-side connections
io.on('connection', (socket) => {
	console.log('a user connected');
	// when a client disconnects from the server
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	
	// when a client sends a card to the server
	socket.on('sentCard', (card) => {
		console.log("Recieved card from a socket");
		console.log(card);
	});
	
	// When a client wants another card for their hand
	socket.on('requestedCard', () => {
		console.log("Someone wants a card");
		socket.emit('requestedCard', Math.floor(Math.random()*100000));
		console.log("Gave them a Card");
	});
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});
