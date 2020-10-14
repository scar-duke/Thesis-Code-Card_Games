var socket = io();
var cardsOnTable = [];

socket.on('maxPlayersReached', function() {
	document.getElementById("sorryText").style.display = "block";
	document.getElementById("readyButton").style.display = "none";
	document.getElementById("nameLabel").style.display = "none";
	document.getElementById("name").style.display = "none";
});

socket.on('gameInProgress', function() {
	document.getElementById("sorryProgressText").style.display = "block";
	document.getElementById("readyButton").style.display = "none";
	document.getElementById("nameLabel").style.display = "none";
	document.getElementById("name").style.display = "none";
});

socket.on('allPlayersReady', function() {
	document.getElementById("waitText").style.display = "none";
	document.getElementById("goButton").style.display = "none";
	document.getElementById("handHeader").style.display = "block";
	document.getElementById("handCanvas").style.visibility = "visible";
	document.getElementById("handHeader").innerHTML = playerName + "'s Hand";
	canChooseCard = true;
});

socket.on('idSent', function(id) {
	socketId = id;
});

socket.on('revealGoButton', function() {
	document.getElementById("goButton").style.display = "block";
});

socket.on('clearTable', function(idsAndScore) {
	cardsOnTable = [];
	updateTableUsers(idsAndScore);
	
	checkForWinner(idsAndScore);
	canChooseCard = true;
});

// used to call forced-winner scenarios (i.e. if we run out of question cards)
socket.on('chooseWinner', function(idsAndScore) {
	var winner = idsAndScore[0][2]
	var winningScore = idsAndScore[0][1];
	for(var i = 1; i < idsAndScore.length; i++) {
		if(idsAndScore[i][1] > winningScore) {
			winner = idsAndScore[i][2];
			winningScore = idsAndScore[i][1];
		}
	}
	// only call the winning code once from the server
	if(socketId == winner) {
		socket.emit('playerHasWon', winner);
	}
});

socket.on('endGame', function(idsAndScore, winner) {
	// disable everything else and display the winner, effectively ending the game
	isTurn = false;
	canChooseCard = false;
	
	document.getElementById("handHeader").style.display = "none";
	document.getElementById("handCanvas").style.display = "none";
	drawWinner(idsAndScore, winner);
	document.getElementById("playAgainButton").style.display = "block";
	document.getElementById("quitButton").style.display = "block";
});

socket.on('requestedCard', function(content) {
	addNewCardToArray(content);
});
socket.on('sentCardSuccess', function() {
	socket.emit('requestedCard');
});
socket.on('updateTableUsers', function(idsAndScore) {
	updateTableUsers(idsAndScore);
});
socket.on('yourTurn', function() {
	console.log("Your Turn");
	isTurn = true;
	canChooseCard = false;
	document.getElementById("handHeader").style.display = "none";
	document.getElementById("handCanvas").style.display = "none";
});

//CAH socket functions
socket.on('displayQuestionCard', function(idsAndScore, content) {
	updateTableWithCard(idsAndScore, content);
});

socket.on('addCardToTable', function(content, id, usersSize) {
	card = new Card(content);
	card.owner = id;
	cardsOnTable.push(card);
	if(cardsOnTable.length == usersSize - 1) {
		if(isTurn) {
			document.getElementById("judgeText").style.display = "block";
		}
		drawCardsToChooseWinnerFrom(cardsOnTable, tableCanvas);
	}
});


// Requests a new card from the server
function getNewCard(socket) {
	socket.emit('requestedCard');
}

// Takes content recieved from the server and adds it to the card hand array
function addNewCardToArray(content) {
	cardArray.push(new Card(content));
	drawOnCanvas(cardArray, handCanvas);
}

// Sends chosen card to server and removes it from the array
function sendCardToServer(socket, card) {
	socket.emit('sentCard', card);
	cardArray.splice(cardArray.indexOf(card), 1);
	drawOnCanvas(cardArray, handCanvas);
}

function checkForWinner(idsAndScore) {
	if(winByRounds) { // if game is set to win after x rounds
		if(round/idsAndScore.length == numOfRounds) {
			// see who has the highest score (make applicable for ties later?)
			var winner = idsAndScore[0][2];
			var winningScore = idsAndScore[0][1]
			for(var i = 1; i < idsAndScore.length; i++) {
				if(idsAndScore[i][1] > winningScore) {
					winner = idsAndScore[i][2];
					winningScore = idsAndScore[i][1];
				}
			}
			// only call the winning code once from the server
			if(socketId == winner) {
				socket.emit('playerHasWon', winner);
			}
		}
		round++;
	} else { // else, game is set to check scores for a possible winner
		for(var i = 0; i < idsAndScore.length; i++) {
			if(idsAndScore[i][1] == scoreToWin) {
				// only call the winning code once from the server
				if(socketId == idsAndScore[i][2]) {
					socket.emit('playerHasWon', idsAndScore[i][2]);
				}
			}
		}
	}
}