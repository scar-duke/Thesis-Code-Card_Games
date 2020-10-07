var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const csv = require('csv-parser');
const fs = require('fs');

// =================================================Set constant variables for server use
const maxPlayers = 7;
const minPlayers = 3;

// =====================================Declare (dynamic) global variables for server use
var users = [];
var idsAndScore = [];
var questionsCardContent = [];
var discardedQuestionCards = [];
var answersCardContent = [];
var discardedAnswerCards = [];

var questionsIndex = 0;
var answersIndex = 0;

var currentTurn = 1;
var turn = 0;

//var roomNum = 1; //rooms don't exist yet
var playersReady = 0;

// ================================================================Parse CSV files
fs.createReadStream('cardFiles/questions.csv')
  .pipe(csv())
  .on('data', (data) => {
	  questionsCardContent.push(data["Questions"]);
})
  .on('end', () => {
	  fs.close(0, (err) => { if(err) {console.error('Failed to close file', err);} });
});
fs.createReadStream('cardFiles/answers.csv')
  .pipe(csv())
  .on('data', (data) => {
	  answersCardContent.push(data["Answers"]);
})
  .on('end', () => {
	  fs.close(1, (err) => { if(err) {console.error('Failed to close file', err);} });
});


// =================Get index file and other required external javascript/css function files
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


// ========================================================Handle the server-side connections
io.on('connection', (socket) => {
	socket.emit('idSent', socket.id);
	if(users.length < maxPlayers) {
		console.log('a user connected');
		io.sockets.emit('updateTableUsers', idsAndScore); //change this when implement rooms
	} else {
		socket.emit('maxPlayersReached');
		socket.disconnect(true);
	}
		// when a client disconnects from the server
		socket.on('disconnect', () => {
			users.splice(users.indexOf(socket), 1);
			for(var i = 0; i < idsAndScore.length; i++) {
				if(idsAndScore[i][2] == socket.id) {
					playersReady--;
					idsAndScore.splice(idsAndScore[i], 1);
				}
			}
			io.sockets.emit('updateTableUsers', idsAndScore);
			console.log('user disconnected');
		});
		socket.on('playerReady', (name) => {
			users.push(socket);
			idsAndScore.push([name, 0, socket.id]);
			io.sockets.emit('updateTableUsers', idsAndScore);
			playersReady++;
			if(users.length >= minPlayers & playersReady == users.length) {
				io.sockets.emit('allPlayersReady');
				
				var qCard = questionsCardContent[Math.floor(Math.random() * questionsCardContent.length)];
				questionsCardContent.splice(questionsCardContent.indexOf(qCard), 1);
				discardedQuestionCards.push(qCard);
				io.sockets.emit('displayQuestionCard', idsAndScore, qCard);
				
				users[0].emit('yourTurn');
			}
		});
	
		// when a client sends a card to the server, put it on the table
		socket.on('sentCard', (card) => {
			console.log("Recieved card from " + socket.id);
			console.log(card);
			io.sockets.emit('addCardToTable', card.content, socket.id, users.length);
			
			//give player another card after they sent one in
			socket.emit('sentCardSuccess');
		});
	
		// When a client wants another card for their hand, send them the CONTENT
		socket.on('requestedCard', () => {
			console.log(socket.id + " wants a card");
			var aCard = answersCardContent[Math.floor(Math.random() * answersCardContent.length)];
			answersCardContent.splice(answersCardContent.indexOf(aCard), 1);
			discardedAnswerCards.push(aCard);
			socket.emit('requestedCard', aCard);
			
			// if all answer cards have been used, reuse the discarded deck
			if(answersCardContent.length <= 0) {
				answersCardContent = discardedAnswerCards;
				discardedAnswerCards = [];
			}
			console.log("Gave them a Card");
		});
		
		// When the choosing player sends their winning choice
		socket.on('winChoice', (card) => {
			console.log(card.content + " by " + card.owner + " won that round");
			for(var i = 0; i < idsAndScore.length; i++) {
				if(idsAndScore[i][2] == card.owner) {
					idsAndScore[i][1] += 1;
				}
			}
			io.sockets.emit('clearTable', idsAndScore);
		});
		
		// When a player has won the game (through rounds or score)
		socket.on('playerHasWon', (winner) => {
			console.log("Game Winner is " + winner);
			
			//io.sockets.emit('endGame', winner);
		});
	
		// Begin the next turn by passing it to the next player in the array
		socket.on('passTurn', () => {
			if(users[turn] == socket) {
				users[(turn+1)%users.length].emit('yourTurn');
				passTurn(socket);
				
				var qCard = questionsCardContent[Math.floor(Math.random() * questionsCardContent.length)];
				questionsCardContent.splice(questionsCardContent.indexOf(qCard), 1);
				discardedQuestionCards.push(qCard);
				io.sockets.emit('displayQuestionCard', idsAndScore, qCard);
				
				if(questionsCardContent.length <= 0) {
					// end the game ///////////////////////////////////////////////////////////////
					
				}
			}
		});
	
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});


// ================================================================Extra methods
function passTurn(socket) {
	turn = currentTurn++ % users.length;
	console.log("next turn triggered");
}