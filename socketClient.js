var socket = io();
socket.on('requestedCard', function(content) {
	addNewCardToArray(content);
});
socket.on('sentCard', function() {
	// do something? Do I even need this?
});