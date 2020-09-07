document.getElementById("testButton").addEventListener("click", function(){getNewCard(socket);});
document.getElementById("testButton2").addEventListener("click", function(){sendCardToServer(socket, cardArray[0]);});

document.getElementById("handCanvas").addEventListener("click", function(e) {
	console.log(getMousePos(document.getElementById("handCanvas"), e));
});
