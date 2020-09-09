var cardArray = [];

window.onload = function () {
	handCanvas.start();
	tableCanvas.start();
	cardArray.push(new Card("Software"));
	cardArray.push(new Card("Engineering"));
	cardArray.push(new Card("Lyfe"));
	drawOnCanvas(handCanvas);
};
var handCanvas = {
	canvas : document.getElementById("handCanvas"),
	start : function() {
		this.canvas.width = window.innerWidth - window.innerWidth/3;
		this.canvas.height = 270;
		this.context = this.canvas.getContext("2d");
	}
}
var tableCanvas = {
	canvas : document.getElementById("tableCanvas"),
	start : function() {
		this.canvas.width = window.innerWidth - window.innerWidth/3;
		this.canvas.height = 350;
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
	
	drawCard(x, y, canvas) {
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

function drawOnCanvas(canvas) {
	var ctx = canvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var x = 20;
	var y = 20;
	for (i = 0; i < cardArray.length; i++) {
		cardArray[i].drawCard(x, y, canvas);
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
    return [
		evt.clientX - rect.left,
		evt.clientY - rect.top
    ];
}

function getClickedCard(x, y) {
	for(var i = 0; i < cardArray.length; i++) {
		if(x > cardArray[i].x & x < cardArray[i].x + cardArray[i].width) {
			if(y > cardArray[i].y & y < cardArray[i].y + cardArray[i].height) {
				return cardArray[i];
			}
		}
	}
}

// table for all players when sent to server
// num of players
// only one person click on table for judging