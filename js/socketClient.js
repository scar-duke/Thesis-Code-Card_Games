var socket = io();

socket.on('requestedCard', function(content) {
	addNewCardToArray(content);
	socket.emit('passTurn');
	document.getElementById("turn").style.display = "none";
	isTurn = false;
});
socket.on('sentCardSuccess', function() {
	socket.emit('passTurn');
	document.getElementById("turn").style.display = "none";
	isTurn = false;
});
socket.on('updateTableUsers', function(numUser) {
	updateTableUsers(numUser);
});
socket.on('yourTurn', function() {
	console.log("Your Turn");
	isTurn = true;
	document.getElementById("turn").style.display = "inline";
	
});
// add a trigger for turn end to hide stuff

// Requests a new card from the server
function getNewCard(socket) {
	socket.emit('requestedCard');
}

// Takes content recieved from the server and adds it to the card hand array
function addNewCardToArray(content) {
	cardArray.push(new Card(content));
	drawOnCanvas(handCanvas);
}

// Sends chosen card to server and removes it from the array
function sendCardToServer(socket, card) {
	socket.emit('sentCard', card);
	cardArray.splice(cardArray.indexOf(card), 1);
	drawOnCanvas(handCanvas);
}