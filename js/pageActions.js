document.getElementById("getCard").addEventListener("click", function(){
	if(isTurn) {
		getNewCard(socket);
	}
});
document.getElementById("handCanvas").addEventListener("click", function(e) {
	xyPair = getMousePos(document.getElementById("handCanvas"), e);
	c = getClickedCard.apply(null, xyPair);
	if(c != undefined & isTurn) {
		sendCardToServer(socket, c);
	}
});

document.getElementById("turn").addEventListener("click", function() {
	socket.emit('passTurn');
	document.getElementById("turn").style.display = "none";
	isTurn = false;
});
