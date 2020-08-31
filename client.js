var cardArray = [];

function startGame() {
	cardArea.start();
	var i;
	var x = 20;
	var y = 20;
	cardArray.push(new Card("Software"));
	for (i = 0; i < cardArray.length; i++) {
		cardArray[i].drawCard(x, y);
		x += 80;
	}
	console.log(cardArray[0].getCardDetails());
}
var cardArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = window.innerWidth - window.innerWidth/3;
		this.canvas.height = 400;
		this.context = this.canvas.getContext("2d");
		document.getElementById("canvasLocation").insertBefore(this.canvas, document.getElementById("canvasLocation").childNodes[0]);
	}
}

class Card {
	constructor(content) {
	this.content = content;
	this.colour = "white";
	this.width = 65;
	this.height = 100;
	this.x = null;
	this.y = null;
	}
	
	getCardDetails() {
		return this.toString();
	}
	
	toString() {
		return "Card with " + this.content + " at (" + this.x + ", " + this.y + ")";
	}
	
	drawCard(x, y) {
		this.x = x;
		this.y = y;
		var ctx = cardArea.context;
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.stroke();
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "black";
		ctx.font = "15px Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.content, this.x + this.width/2, this.y + this.height/2);
	}
}



function onClick(card) {
	card
}

// MAKE AN ARRAY OF CARDS, EVERY TIME A CARD DISAPPEARS REMOVE FROM THE ARRAY AND REDRAW ALL OF THEM
// MAKE CLICKABLE EVENT ON CANVAS GONNA HAVE TO DO MATH TO SEE IF A CARD WAS CLICKED ON

function getNewCard(socket) {
	socket.emit('requestedCard');
}

function addNewCardToArray(content) {
	cardArray.push(new Card(content));
	console.log(cardArray[1].toString());
}