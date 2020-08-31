var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Get index file and other required external javascript/css function files
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/client.js', (req, res) => {
	res.sendFile(__dirname + '/client.js');
});


// Handle the server-side connections
io.on('connection', (socket) => {
	console.log('a user connected');
	// when a client disconnects from the server
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	
	// when a client sends a card to the server
	socket.on('sentCard', (cardContent) => {
		console.log(cardContent);
	});
	
	socket.on('requestedCard', () => {
		console.log("Someone wants a card");
		socket.emit('requestedCard', "A Card");
		console.log("Gave them a Card");
	});
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});
