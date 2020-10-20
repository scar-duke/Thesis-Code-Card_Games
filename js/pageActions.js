document.getElementById("readyButton").addEventListener("click", function() {
	if(roomToJoin != undefined) {
		document.getElementById("waitText").style.display = "block";
		document.getElementById("nameLabel").style.display = "none";
		document.getElementById("name").style.display = "none";
		document.getElementById("readyButton").style.display = "none";
		document.getElementById("chooseRoom").style.display = "none";
		document.getElementById("roomsTable").style.display = "none";
		playerName = document.getElementById("name").value;
		socket.emit('playerReady', playerName, roomToJoin);
	}
	
});

document.getElementById("goButton").addEventListener("click", function() {
	socket.emit('startGame');
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
		document.getElementById("handHeader").style.display = "block";
		document.getElementById("handCanvas").style.display = "block";
		document.getElementById("judgeText").style.display = "none";
		socket.emit('passTurn');
	}
});
	

document.title = profName + "'s Community Judge Game";
document.getElementById("titleHeader").innerHTML = profName + "'s Community Judge Game";

//document.getElementById("turn").addEventListener("click", function() {
//	socket.emit('passTurn');
//	document.getElementById("turn").style.display = "none";
//	isTurn = false;
//});
