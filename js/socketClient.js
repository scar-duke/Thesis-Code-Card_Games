var socket = io();
var cardsOnTable = [];

socket.on('maxPlayersReached', function() {
	document.getElementById("sorryText").style.display = "block";
	document.getElementById("readyButton").style.display = "none";
});

socket.on('allPlayersReady', function() {
	document.getElementById("waitText").style.display = "none";
	document.getElementById("handCanvas").style.display = "block";
	canChooseCard = true;
});

socket.on('clearTable', function(idsAndScore) {
	cardsOnTable = [];
	updateTableUsers(idsAndScore);
	canChooseCard = true;
});

socket.on('requestedCard', function(content) {
	addNewCardToArray(content);
	//socket.emit('passTurn');
	//document.getElementById("turn").style.display = "none";
	//isTurn = false;
});
socket.on('sentCardSuccess', function() {
	socket.emit('requestedCard');
	//socket.emit('passTurn');
	//document.getElementById("turn").style.display = "none";
	//isTurn = false;
});
socket.on('updateTableUsers', function(idsAndScore) {
	updateTableUsers(idsAndScore);
});
socket.on('yourTurn', function() {
	console.log("Your Turn");
	isTurn = true;
	canChooseCard = false;
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
		drawCardsToChooseWinnerFrom(cardsOnTable, tableCanvas);
		socket.emit('chooseWinningCard');
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