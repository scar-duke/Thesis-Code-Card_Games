document.getElementById("testButton").addEventListener("click", function(){getNewCard(socket);});

document.getElementById("handCanvas").addEventListener("click", function(e) {
	xyPair = getMousePos(document.getElementById("handCanvas"), e);
	sendCardToServer(socket, getClickedCard.apply(null, xyPair));
});
