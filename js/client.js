var cardArray = [];
var playerName = "";
var socketId = "";
var isTurn = false;
var canChooseCard = false;
var round = 1;
var currentQuestion;

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
		this.canvas.height = spaceBetweenCards*2 + cardHeight;
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
	this.colour = handCardColour;
	this.width = cardWidth;
	this.height = cardHeight;
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
		ctx.font = cardFontSize + "px " + fontType;
		ctx.textAlign = "center";
		this.checkTextOnCard(ctx, this.content);
	}
	
	checkTextOnCard(ctx, txt) {
		var ret = "";
		var lineHeight = this.height - (cardFontSize + cardFontSize*.5);
		if(ctx.measureText(txt).width > this.width) {
			var res = txt.split(" ");
			for(var i = 0; i < res.length; i++) {
				if(ctx.measureText(ret + " " + res[i]).width < this.width) {
					ret += res[i] + " ";
				} else {
					ret = ret.substring(0, ret.length-1); // gets rid of the space at the end
					ctx.fillText(ret, this.x + this.width/2, this.y + this.height-lineHeight);
					lineHeight -= cardFontSize;
					i--;
					ret = "";
				}
			}
		} else { // content is fine, doesn't need put on multiple lines
			ret = txt;
			ctx.fillText(ret, this.x + this.width/2, this.y + this.height-lineHeight);
			ret = "";
		}
		
		ctx.fillText(ret, this.x + this.width/2, this.y + this.height-lineHeight);
	}
}

function drawOnCanvas(cardArray, canvas) {
	var ctx = canvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var x = 20;
	var y = 20;
	var changeX = cardWidth + spaceBetweenCards;
	var changeY = cardHeight + spaceBetweenCards;
	for (i = 0; i < cardArray.length; i++) {
		cardArray[i].drawCard(x, y, canvas);
		x += changeX;
		
		//if card width added to x position would put it off the canvas, move down
		if(x + changeX > ctx.canvas.width) {
			x = 20;
			y += changeY;
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
	for(var i = 0; i < userIds.length; i++) {
		ctx.fillStyle = fontColour;
		ctx.font = tableFontSize + "px " + fontType;
		ctx.textAlign = "left";
		if(userIds[i][2] == socketId) {
			ctx.font = "bold " + tableFontSize + "px " + fontType;
		}
		ctx.fillText(userIds[i][0] + " - ", x, y);
		y += 40;
	}
}

function updateTableWithCard(userIds, content) {
	var ctx = tableCanvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	x = 20;
	y = 40;
	// put in dummy string variable to determine where to place card out of way of player details
	var playerTextWidth = ctx.measureText("Player 1: 10").width;
	for(var i = 0; i < userIds.length; i++) {
		ctx.fillStyle = fontColour;
		ctx.font = tableFontSize + "px " + fontType;
		ctx.textAlign = "left";
		if(userIds[i][2] == socketId) {
			ctx.font = "bold " + tableFontSize + "px " + fontType;
		}
		ctx.fillText(userIds[i][0] +" - " + userIds[i][1], x, y);
		y += 40;
	}
	x = playerTextWidth * 2;
	y = 40;
	currentQuestion = new Card(content);
	currentQuestion.colour = questionCardColour;
	currentQuestion.drawCard(x, y, tableCanvas);
}

function drawCardsToChooseWinnerFrom(cardArray, canvas) {
	var ctx = canvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var x = 20;
	var y = 20;
	changeX = cardWidth + spaceBetweenCards;
	changeY = cardHeight + spaceBetweenCards;
	currentQuestion.drawCard(x, y, tableCanvas);
	x += changeX;
	for (i = 0; i < cardArray.length; i++) {
		cardArray[i].drawCard(x, y, canvas);
		x += changeX;
		
		//if card width added to x position would put it off the canvas, move down
		if(x + changeX > ctx.canvas.width) {
			x = 20;
			y += changeY;
		}
	}
}

function drawWinner(idsAndScore, winnerId) {
	var ctx = tableCanvas.context;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var winner;
	var score;
	var x = ctx.canvas.width / 2;
	var y = ctx.canvas.height / 2;
	
	
	ctx.fillStyle = fontColour;
	ctx.font = tableFontSize + "px " + fontType;
	ctx.textAlign = "center";
	for(var i = 0; i < idsAndScore.length; i++) {
		if(idsAndScore[i][2] == winnerId) {
			winner = idsAndScore[i][0];
			score = idsAndScore[i][1];
		}
	}
	ctx.fillText("The winner is: " + winner + " with a score of " + score + "!", x, y);
}

// make canvas dynamic BUT NOT AUGMENT CARD SIZES FOR CLICKING BECAUSE THAT'S FUCKED UP RIGHT NOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
// make table look better (and make card and players wrap around like the hand)
// Other quality of life features (augmenting ready players to work w/o restarting, better html, etc.)