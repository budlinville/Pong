const CANVAS_SIZE = 400;
const PADDLE_LENGTH = 60;
const PADDLE_WIDTH = 10;
const BALL_DIAM = 15;
var usrPad;
var compPad;
var ball;
var ai;

var runGame = false;

//TODO: add multiplayer.
//		add UI
function setup() {
	createDiv(" \
		<input type='button' value='Start' onclick='startGame();' /> \
		<input type='button' value='Pause' onclick='pauseGame();' /> \
	");
	createCanvas(CANVAS_SIZE, CANVAS_SIZE);
	usrPad = new Paddle(0);
	compPad = new Paddle(CANVAS_SIZE - PADDLE_WIDTH);
	ai = new Computer(compPad);
	ball = new Ball();
}

function draw() {
	if (runGame) {
		background(51);	//make dark grey
		usrPad.update();
		ai.update();
		ball.update();
		usrPad.show();
		ai.show();
		ball.show();
	}
}

function startGame() {
	runGame = true;
}

function pauseGame() {
	runGame = false;
	drawPauseSymbol();
}

function drawPauseSymbol() {
	rect((width/2 - PADDLE_WIDTH*3 - PADDLE_WIDTH), (height/2 - PADDLE_LENGTH), (PADDLE_WIDTH*2), (PADDLE_LENGTH*2));
	rect((width/2 + PADDLE_WIDTH*3), (height/2 - PADDLE_LENGTH), (PADDLE_WIDTH*2), (PADDLE_LENGTH*2));
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		usrPad.changeSpeed(-10);
	} else if (keyCode === DOWN_ARROW) {
		usrPad.changeSpeed(10);
	}
}

function keyReleased() {
	usrPad.changeSpeed(0);
}

function resetScreen() {
	setup();	//TODO: not resetScreen everything
}

function Paddle(x) {
	this.xPos = x;
	this.yPos = 0;
	this.speed = 0;

	this.changeSpeed = function(val) {
		this.speed = val;
	}

	this.checkHitBox = function(x, y) {
		if (((x - BALL_DIAM / 2) <= PADDLE_WIDTH || (x + BALL_DIAM / 2) >= width - PADDLE_WIDTH) 
				&& ((y - BALL_DIAM / 2) >= this.yPos && (y + BALL_DIAM / 2) <= (this.yPos + PADDLE_LENGTH))) {
			return true;
		} else {
			return false;
		}
	}

	this.update = function() {
		this.yPos += this.speed;
		this.yPos = constrain(this.yPos, 0, (height - PADDLE_LENGTH));
	}

	this.show = function() {
		fill(255);	//make white
		rect(this.xPos, this.yPos, PADDLE_WIDTH, PADDLE_LENGTH)
	}
}

function Ball() {
	this.xPos = width/2;
	this.yPos = height/2;
	this.xSpeed = 3;
	this.ySpeed = 3;
	this.score = 0;
	
	this.changeSpeed = function(xVal, yVal) {
		this.xSpeed = xVal;
		this.ySpeed = yVal;
	}
	
	this.checkCollisions = function() {
		//use center of ball
		if (usrPad.checkHitBox((this.xPos + (BALL_DIAM / 2), (this.yPos + BALL_DIAM / 2))) 
			|| compPad.checkHitBox((this.xPos + (BALL_DIAM / 2)), (this.yPos + BALL_DIAM / 2))) {	//bounce off paddle
			this.xSpeed *= -1;
			//this.ySpeed *= -1;
		} else if ((this.yPos == 0) || (this.yPos == height - BALL_DIAM)) {	//bounce off top or bottom walls
			this.ySpeed *= -1;
		} else if (this.xPos == 0) {	//comp scores
			compPad.score++;
			console.log(compPad.score);
			resetScreen();
			console.log("c");
		} else if (this.xPos == width) {	//player scores
			usrPad.score++;
			console.log(usrPad.score);
			resetScreen();
			console.log("d");
		}
	}

	this.update = function() {
		this.xPos += this.xSpeed;
		this.xPos = constrain(this.xPos, 0, (width - BALL_DIAM));
		this.yPos += this.ySpeed;
		this.yPos = constrain(this.yPos, 0, (height - BALL_DIAM));
		this.checkCollisions();
	}

	this.show = function() {
		fill(255);	//make white
		ellipse(this.xPos, this.yPos, BALL_DIAM, BALL_DIAM)
	}
}

function Computer(pad) {
	this.paddle = pad;

	this.update = function() {
		this.paddle.yPos = ball.yPos;
		this.paddle.yPos = constrain(this.paddle.yPos, 0, (height - BALL_DIAM));
	}

	this.show = function() {
		pad.show();
	}
}