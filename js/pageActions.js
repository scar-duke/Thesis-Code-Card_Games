document.getElementById("testButton").addEventListener("click", function(){getNewCard(socket);});

document.getElementById("handCanvas").addEventListener("click", function(e) {
	xyPair = getMousePos(document.getElementById("handCanvas"), e);
	c = getClickedCard.apply(null, xyPair);
	if(c != undefined) {
		sendCardToServer(socket, c);
	}
});
