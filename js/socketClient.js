var socket = io();

socket.on('requestedCard', function(content) {
	addNewCardToArray(content);
});
socket.on('sentCard', function() {
	// do something? Do I even need this?
});
socket.on('updateTableUsers', function(numUser) {
	updateTableUsers(numUser);
});


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