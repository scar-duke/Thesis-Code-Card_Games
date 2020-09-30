var cardArray = [];
var isTurn = false;
var canChooseCard = false;

window.onload = function () {
	handCanvas.start();
	tableCanvas.start();
	for(i = 0; i < numOfCardsInHand; i++) {
		socket.emit('requestedCard');
	}
	drawOnCanvas(cardArray, handCanvas);
};
var handCanvas = {
	canvas : document.getElementById("handCanvas"),
	start : function() {
		this.canvas.width = window.innerWidth - window.innerWidth/3;
		this.canvas.height = 150;
		this.context = this.canvas.getContext("2d");
	}
}
var tableCanvas = {
	canvas : document.getElementById("tableCanvas"),
	start : function() {
		this.canvas.width = window.innerWidth - window.innerWidth/3;
		this.canvas.height = 400;
		this.context = this.canvas.getContext("2d");
	}
}

class Card {
	constructor(content) {
	this.content = content;
	this.colour = handCardColour;
	this.width = 80;
	this.height = 110;
	this.x = null;
	this.y = null
	this.owner = null;
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
		if(this.colour == handCardColour) {
			ctx.fillStyle = fontColour;
		} else {
			ctx.fillStyle = questionFontColour;
		}
		ctx.font = cardFontSize + " " + fontType;
		ctx.textAlign = "center";
		this.checkTextOnCard(ctx, this.content);
		//ctx.fillText(this.content, this.x + this.width/2, this.y + this.height/2);
	}
	
	checkTextOnCard(ctx, txt) {
		var ret = "";
		var lineHeight = 4;
		if(ctx.measureText(txt).width > this.width) {
			var res = txt.split(" ");
			for(var i = 0; i < res.length; i++) {
				if(ctx.measureText(ret + " " + res[i]).width < this.width) {
					ret += res[i] + " ";
				} else {
					ret = ret.substring(0, ret.length-1); // get rid of the space at the end
					ctx.fillText(ret, this.x + this.width/2, this.y + this.height/lineHeight);
					lineHeight -= 1.5;
					i--;
					ret = "";
				}
			}
		} else { // content is fine, doesn't need put on multiple lines
			ret = txt;
			ctx.fillText(ret, this.x + this.width/2, this.y + this.height/lineHeight);
			ret = "";
		}
		
		ctx.fillText(ret, this.x + this.width/2, this.y + this.height/lineHeight);
	}
}

function drawOnCanvas(cardArray, canvas) {
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

function getWinningCard(x, y) {
	for(var i = 0; i < cardsOnTable.length; i++) {
		if(x > cardsOnTable[i].x & x < cardsOnTable[i].x + cardsOnTable[i].width) {
			if(y > cardsOnTable[i].y & y < cardsOnTable[i].y + cardsOnTable[i].height) {
				return cardsOnTable[i];
			}
		}
	}
}

function updateTableUsers(userIds) {
	var ctx = tableCanvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	x = 20;
	y = 40;
	for(var i = 1; i < userIds.length+1; i++) {
		ctx.fillStyle = fontColour;
		ctx.font = tableFontSize + " " + fontType;
		ctx.textAlign = "left";
		ctx.fillText("Player " + i +": ", x, y);
		y += 40;
	}
}

function updateTableWithCard(userIds, content) {
	var ctx = tableCanvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	x = 20;
	y = 40;
	for(var i = 0; i < userIds.length; i++) {
		ctx.fillStyle = fontColour;
		ctx.font = tableFontSize + " " + fontType;
		ctx.textAlign = "left";
		num = i + 1;
		ctx.fillText("Player " + num +": " + userIds[i][1], x, y);
		y += 40;
	}
	var c = new Card(content);
	c.colour = questionCardColour;
	c.drawCard(x, y, tableCanvas);
}

// make words fit on cards (other type of container that wraps? Look into it)
// make canvas dynamic
// make table look better (and make card and players wrap around like the hand)
// add a score
// Title bar, general look
// Other quality of life features (augmenting ready players to work w/o restarting, better html, etc.)

// randomly pick player to go first