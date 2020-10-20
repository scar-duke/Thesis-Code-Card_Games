var socket = io();
var cardsOnTable = [];
var roomToJoin;

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

socket.on('availableRooms', function(usersInRooms, maxPlayers) {
	var table = document.getElementById("roomsTable");
	var placeInArray = 0;
	var roomNum = 1;
	
	for(var i = 0; i < usersInRooms.length/2; i++) {
		var x = document.createElement("TR");
		x.setAttribute("id", "row"+i);
		table.appendChild(x);
		
		for(var j = 0; j < 2; j++) {
			if(usersInRooms[placeInArray] != undefined) {
				var y = document.createElement("TD");
				y.setAttribute("id", placeInArray);
				var z = document.createTextNode("Room " + roomNum + ": " +
											usersInRooms[placeInArray] + "/" + maxPlayers);
				y.appendChild(z);
				document.getElementById("row"+i).appendChild(y);
				roomNum++;
				placeInArray++;
			}
		}
	}
	
	var row = document.getElementById('roomsTable').rows;
	for(var i = 0; i < row.length; i++) {
        for(var j = 0; j < row[i].cells.length; j++ ) {
            row[i].cells[j].addEventListener('click', function(){
				for(var i = 0; i < row.length; i++) {
					for(var j = 0; j < row[i].cells.length; j++) {
						row[i].cells[j].style.backgroundColor = "white";
						row[i].cells[j].style.color = "black";
					}
				}
				if(usersInRooms[parseInt(this.id)] < maxPlayers) {
					document.getElementById("readyButton").style.display = "block";
					this.style.backgroundColor = roomTableSelectColour;
					this.style.color = "white";
					roomToJoin = this.id;
				}
            });
        }
    }
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
});

socket.on('requestedCard', function(content) {
	addNewCardToArray(content);
});
socket.on('sentCardSuccess', function() {
	socket.emit('requestedCard');
});
socket.on('updateTableUsers', function(idsAndScore) {
	if(playerName != undefined) {
		var room = parseInt(roomToJoin) + 1;
		document.getElementById("roomTitle").innerHTML = "Room " + room;
	}
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