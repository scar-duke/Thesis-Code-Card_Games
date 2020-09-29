document.getElementById("readyButton").addEventListener("click", function() {
	document.getElementById("waitText").style.display = "inline";
	document.getElementById("readyButton").style.display = "none";
	socket.emit('playerReady');
});

document.getElementById("getCard").addEventListener("click", function(){
	if(canChooseCard) {
		getNewCard(socket);
	}
});
document.getElementById("handCanvas").addEventListener("click", function(e) {
	xyPair = getMousePos(document.getElementById("handCanvas"), e);
	c = getClickedCard.apply(null, xyPair);
	if(c != undefined & canChooseCard) {
		sendCardToServer(socket, c);
		canChooseCard = false;
	}
});

document.getElementById("tableCanvas").addEventListener("click", function(e) {
		xyPair = getMousePos(document.getElementById("tableCanvas"), e);
		c = getWinningCard.apply(null, xyPair);
		if(c != undefined & isTurn) {
			socket.emit('winChoice', c);
			isTurn = false;
			canChooseCard = true;
			document.getElementById("handCanvas").style.display = "block";
			socket.emit('passTurn');
		}
	});

//document.getElementById("turn").addEventListener("click", function() {
//	socket.emit('passTurn');
//	document.getElementById("turn").style.display = "none";
//	isTurn = false;
//});
