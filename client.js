var cardArray = [];

window.onload = function () {
	canvas.start();
	cardArray.push(new Card("Software"));
	cardArray.push(new Card("Engineering"));
	cardArray.push(new Card("Lyfe"));
	drawOnCanvas();
	console.log(cardArray.toString());
};
var canvas = {
	canvas : document.getElementById("handCanvas"),
	start : function() {
		this.canvas.width = window.innerWidth - window.innerWidth/3;
		this.canvas.height = 400;
		this.context = this.canvas.getContext("2d");
	}
}

class Card {
	constructor(content) {
	this.content = content;
	this.colour = "white";
	this.width = 80;
	this.height = 110;
	this.x = null;
	this.y = null;
	}
	
	getCardDetails() {
		return this.toString();
	}
	
	toString() {
		return "Card with \"" + this.content + "\" at (" + this.x + ", " + this.y + ")";
	}
	
	drawCard(x, y) {
		this.x = x;
		this.y = y;
		var ctx = canvas.context;
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

function drawOnCanvas() {
	var ctx = canvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var x = 20;
	var y = 20;
	for (i = 0; i < cardArray.length; i++) {
		cardArray[i].drawCard(x, y);
		x += 100;
		
		//if card width added to x position would put it off the canvas, move down
		if(x + 80 > ctx.canvas.width) {
			x = 20;
			y += 130;
		}
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
    };
}


// MAKE CLICKABLE EVENT ON CANVAS GONNA HAVE TO DO MATH TO SEE IF A CARD WAS CLICKED ON

// Requests a new card from the server
function getNewCard(socket) {
	socket.emit('requestedCard');
}

// Takes content recieved from the server and adds it to the card hand array
function addNewCardToArray(content) {
	cardArray.push(new Card(content));
	drawOnCanvas();
}

// Sends chosen card to server and removes it from the array
function sendCardToServer(socket, card) {
	socket.emit('sentCard', card);
	cardArray.splice(cardArray.indexOf(card), 1);
	drawOnCanvas();
}