const CANVAS_WIDTH = screen.width * 2 / 3;
const CANVAS_HEIGHT = screen.height * 2 / 3;
const PADDLE_LENGTH = CANVAS_HEIGHT / 5;
const PADDLE_WIDTH = PADDLE_LENGTH / 6;
const BALL_DIAM = PADDLE_LENGTH / 5;

var usrPad;
var compPad;
var ball;
var ai;
var runGame = false;

//TODO: add multiplayer.
//		add UI
function setup() {
	createDiv(" \
		<div id='topper'> \
			<input type='button' value='Start' onclick='startGame();' /> \
			<input type='button' value='Pause' onclick='pauseGame();' /> \
			<h3 id='usr'>User: 0</h3> \
			<h3 id='comp'>Computer: 0</h3> \
			<p id='info'></p>\
		</div> \
	");
	var cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	background(255, 0, 200);
	
	usrPad = new Paddle(0);
	compPad = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH);
	ai = new Computer(compPad);
	ball = new Ball();
}

function draw() {
	if (runGame) {
		background(51);	//make dark grey
		line(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT); //draw halfway line
	
		usrPad.update();
		ai.update();
		ball.update();
		usrPad.show();
		ai.show();
		ball.show();
	}
}

function startGame() {
	//these three lines added for end game purposes
	document.getElementById('usr').innerHTML = "User: " + usrPad.score;
	document.getElementById('comp').innerHTML = "Computer: " + compPad.score;
	document.getElementById("info").innerHTML = "";
	
	runGame = true;
}

function pauseGame() {
	runGame = false;
	drawPauseSymbol();
}

function drawPauseSymbol() {
	fill(200);
	rect((width/2 - PADDLE_WIDTH*3 - PADDLE_WIDTH*2), (height/2 - PADDLE_LENGTH), (PADDLE_WIDTH*2), (PADDLE_LENGTH*2));
	rect((width/2 + PADDLE_WIDTH*3), (height/2 - PADDLE_LENGTH), (PADDLE_WIDTH*2), (PADDLE_LENGTH*2));
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		usrPad.changeSpeed(-10);
	} else if (keyCode === DOWN_ARROW) {
		usrPad.changeSpeed(10);
	} else if (keyCode === 32) {
		if (runGame) {
			pauseGame()
		} else {
			startGame();
		}
	}
}

function keyReleased() {
	usrPad.changeSpeed(0);
}

function resetScreen() {
	ball = new Ball();
}

function updateScores() {
	document.getElementById('usr').innerHTML = "User: " + usrPad.score;
	document.getElementById('comp').innerHTML = "Computer: " + compPad.score;
	
	if (usrPad.score == 3) {
		document.getElementById("info").innerHTML = "User has won. Please press Start to restart.";
		gameOver();
	} else if (compPad.score == 3) {
		document.getElementById("info").innerHTML = "Computer has won. Please press Start to restart.";
		pauseGame();
		gameOver();
	}
}

function gameOver() {
	usrPad.score = 0;
	compPad.score = 0;
	runGame = false;
}

function Paddle(x) {
	this.xPos = x;
	this.yPos = 0;
	this.speed = 0;
	this.score = 0;

	this.changeSpeed = function(val) {
		this.speed = val;
	}

	this.checkHitBox = function(x, y) {
		if (((x <= PADDLE_WIDTH) || (x >= width - PADDLE_WIDTH)) 
				&& ((y >= this.yPos) && (y <= (this.yPos + PADDLE_LENGTH)))) {
			return true;
		} else {
			return false;
		}
	}

	this.update = function() {
		this.yPos += this.speed;
		this.yPos = constrain(this.yPos, 0, (height - PADDLE_LENGTH - 1));
	}

	this.show = function() {
		fill(255);	//make white
		rect(this.xPos, this.yPos, PADDLE_WIDTH, PADDLE_LENGTH)
	}
}

function Ball() {
	this.xPos = width/2;
	this.yPos = height/2;
	this.xSpeed = 8;
	this.ySpeed = 6;
	
	this.changeSpeed = function(xVal, yVal) {
		this.xSpeed = xVal;
		this.ySpeed = yVal;
	}
	
	this.checkCollisions = function() {
		//use center of ball
		if (usrPad.checkHitBox(this.xPos, (this.yPos + BALL_DIAM / 2)) 
			|| compPad.checkHitBox((this.xPos + BALL_DIAM), (this.yPos + BALL_DIAM / 2))) {	//bounce off paddle
			this.xSpeed *= -1;
		} else if ((this.yPos == 0) || (this.yPos == height - BALL_DIAM)) {	//bounce off top or bottom walls
			this.ySpeed *= -1;
		} else if (this.xPos == 0) {	//comp scores
			compPad.score++;
			console.log(compPad.score);
			resetScreen();
			updateScores();
		} else if (this.xPos == width) {	//player scores
			usrPad.score++;
			console.log(usrPad.score);
			resetScreen();
			updateScores();
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
		ellipse((this.xPos + BALL_DIAM / 2), this.yPos, BALL_DIAM, BALL_DIAM);	//hack
	}
}

function Computer(pad) {
	this.paddle = pad;

	this.update = function() {
		if (this.paddle.ypos >= CANVAS_HEIGHT - PADDLE_LENGTH) {
			this.paddle.yPos = CANVAS_HEIGHT - PADDLE_LENGTH;
		} else {
			this.paddle.yPos = ball.yPos - PADDLE_LENGTH / 2;
		}
		this.paddle.yPos = constrain(this.paddle.yPos, 0, (height - PADDLE_LENGTH - 1));
	}

	this.show = function() {
		pad.show();
	}
}