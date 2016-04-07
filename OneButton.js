window.addEventListener("load", function() {
	
	keyState = {};
	window.addEventListener('keydown',function(e){
		keyState[e.keyCode || e.which] = true;
	},true);
	window.addEventListener('keyup',function(e){
		keyState[e.keyCode || e.which] = false;
	},true);

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.style.visibility = "visible";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	Initialize();

	var StartText = "Press L to begin (and to play with)";
	PositionText(StartText);


});

var Player = {
	width: 100,
	height: 100
}
function BeginGame() {
	canvas.style.visibility = "visible";
	setInterval(function(){
		if (Timer == 0){
			Timer = 0;
			EndGame();
		}
		else {
			Timer--;
		}
	}, 1000);
	gameMusic.volume = 1;
	if (typeof gameMusic.loop == 'boolean'){
    	gameMusic.loop = true;
	}else {
    gameMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
	}
	gameMusic.play();
	Drawing = setInterval(function(){draw()}, DrawingIntervalTime);
	Shrinking = setInterval(function(){ChangeObject()}, shrinkIntervalTime);
}

function PositionText(Text) {
	TextWidth = Math.round(ctx.measureText(Text).width);
	TextHeight = 40;

	TextX = ((canvas.width / 2) - (TextWidth / 2));
	TextY = ((canvas.height / 2) - (TextHeight / 2));

	ctx.fillText(Text,TextX,TextY);
}	

function EndGame() {
	clearInterval(Drawing);
	clearInterval(Shrinking);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var EndText = "Je tijd is om";
	ctx.fillText(EndText,250,400);

	var Endscore = "Je eind score is: " + scoreNumber + " punten";
	ctx.fillText(Endscore,250,450);

}

function Initialize() {
	keyLoop();
	allowChange = true;
	expanding = false;
	Game = false;
	ExpandSpeed = 3;
	ShrinkSpeed = 1.3;
	scoreNumber = 0;
	Timer = 60;
	shrinkIntervalTime = 50;
	DrawingIntervalTime = 11;
	moveNumber = (DrawingIntervalTime * 50);

	ctx.font = "40px Arial";
	ctx.fillStyle = 'white';
	gameMusic = new Audio('game-music-2.wav');

	ColorList1 = ["red", "green"];
	GoalColor = Math.floor(Math.random()*ColorList1.length);

	ColorList2 = ["orange", "violet", "purple"];
	PlayerColor = Math.floor(Math.random()*ColorList2.length);

	GoalWidthBig = [200, 250];
	GoalWHB = Math.floor(Math.random()*GoalWidthBig.length);

	GoalWidthSmall = [50, 100];
	GoalWHS = Math.floor(Math.random()*GoalWidthSmall.length);

	GoalWidth = 200;
	GoalHeight = 200;
		
	PlayerX = 600;
	PlayerY = 600;
	GoalX = 50;
	GoalY = 80;
	//IndicatorX = (PlayerX - 5);
	//IndicatorY = (PlayerY - 5);
	//IndicatorWidth = (Player.width + 10);
	//IndicatorHeight = (Player.height + 10);

	direction = -1;
	distanceX = PlayerX - GoalX;
	distanceY = PlayerY - GoalY;
	//r = 0;
	//g = 255;
	//b = 0;
	//alpha = 0.2;

}

function MakePlayer() {
	ctx.fillStyle = (ColorList2[PlayerColor]);
	ctx.fillRect(PlayerX, PlayerY, Player.width, Player.height);
}

function MakeGoal(GoalX, GoalY, GoalWidth, GoalHeight) {
	//ctx.lineWidth = 1;
	//ctx.strokeStyle = (ColorList1[GoalColor]);
	//ctx.strokeRect(GoalX, GoalY, GoalWidth, GoalHeight);
	ctx.fillStyle = 'white';
	ctx.fillRect(GoalX, GoalY, GoalWidth, GoalHeight);
}

function Indicator() {
	if(Player.width > (GoalWidthBig[GoalWHB] - 10) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 10) && Player.height < GoalWidthBig[GoalWHB]) {
		alpha = 1;
	}
	else {
		alpha = 0.1;
	}
	ctx.strokeStyle = "rgba("+r+","+g+","+b+","+alpha+")";
	ctx.lineWidth = 15;
	ctx.strokeRect(IndicatorX, IndicatorY, IndicatorWidth, IndicatorHeight);
}

function Attributes() {

	var Score = "Score: " + scoreNumber;
	ctx.fillText(Score,1500,50);

	var Time = "Time: " + Timer;
	ctx.fillText(Time,10,50);
}

function ChangeObject() {
	if (Player.width <= 0 && Player.height <= 0) {
		Player.width = 0;
		Player.height = 0;
	}

	if(expanding == true) {
		Player.width -= ShrinkSpeed;
		Player.height -= ShrinkSpeed;
		//IndicatorWidth -= ShrinkSpeed;
		//IndicatorHeight -= ShrinkSpeed;
	}
	if(expanding == false) {
		Player.width += ShrinkSpeed;
		Player.height += ShrinkSpeed;
		//IndicatorWidth -= ShrinkSpeed;
		//IndicatorHeight -= ShrinkSpeed;
	}

}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	MakeGoal(GoalX, GoalY, GoalWidth, GoalHeight);
	Attributes();
	MakePlayer();
	update();
	
}

function update() {
	//scoreNumber += Math.floor(Math.random()*20);
    if (allowChange == true && direction == -1 && PlayerX >= GoalX - 0.1 && PlayerX <= GoalX + 0.1 && PlayerY >= GoalY - 0.1 && PlayerY <= GoalY + 0.1) {
    	bonusPoint();
    	allowChange = false;
		setTimeout(function(){
		allowChange = true;
		littleX = Math.floor((Math.random()*((canvas.width / 2))) + 300);
		littleY = 300;
		direction = 1;
		changeGoal(littleX,littleY,GoalWidthSmall[GoalWHS],GoalWidthSmall[GoalWHS]);
		distanceX = GoalX - PlayerX;
		distanceY = GoalY - PlayerY;
		}, 0);
	}
	else if (direction == -1) {
        expanding = true;
		movePlayer((distanceX / moveNumber),(distanceY / moveNumber));
		
		//IndicatorX = (PlayerX - 5);
		//IndicatorY = (PlayerY - 5);
		//Indicator();
	}

	if (allowChange == true && direction == 1 && PlayerX >= GoalX - 0.1 && PlayerX <= GoalX + 0.1 && PlayerY >= GoalY - 0.1 && PlayerY <= GoalY + 0.1) {
		bonusPoint();
		allowChange = false;
		setTimeout(function(){
		allowChange = true;
		bigX = Math.floor((Math.random()*((canvas.width / 2) - 400)) + 50);
		bigY = 100;
		direction = -1;
		changeGoal(bigX,bigY,GoalWidthBig[GoalWHB],GoalWidthBig[GoalWHB]);
		distanceX = PlayerX - GoalX;
		distanceY = PlayerY - GoalY;
		}, 0);
	}
	else if (direction == 1){
		expanding = false;
		movePlayer((distanceX / -moveNumber),(distanceY / -moveNumber));
	}


}


//wanneer? als player vorige goal heeft bereikt
function changeGoal(newX, newY, width, height)
{
	//verander pos en size van goal
	console.log("Change Log");
	GoalX = newX;
	GoalY = newY;
	GoalWidth = width;
	GoalHeight = height;
}
function movePlayer(mx,my)
{
	PlayerX -= mx;
	PlayerY -= my;

}

function bonusPoint() {
	pointcondition1 = (Player.width == GoalWidth && Player.height == GoalHeight);
	pointcondition2 = (Player.width > (GoalWidth - 10) && Player.width < GoalWidth && Player.height > (GoalHeight - 10) && Player.height < GoalHeight);
	pointcondition3 = (Player.width > (GoalWidth - 20) && Player.width < GoalWidth && Player.height > (GoalHeight - 20) && Player.height < GoalHeight);
	pointcondition4 = (Player.width > (GoalWidth - 30) && Player.width < GoalWidth && Player.height > (GoalHeight - 30) && Player.height < GoalHeight);
	pointcondition5 = (Player.width > (GoalWidth - 40) && Player.width < GoalWidth && Player.height > (GoalHeight - 40) && Player.height < GoalHeight);
	pointcondition6 = (Player.width > (GoalWidth - 50) && Player.width < GoalWidth && Player.height > (GoalHeight - 50) && Player.height < GoalHeight);
	pointcondition7 = (Player.width > (GoalWidth - 60) && Player.width < GoalWidth && Player.height > (GoalHeight - 60) && Player.height < GoalHeight);

	pointvalue1 = 1000;
	pointvalue2 = 900;
	pointvalue3 = 800;
	pointvalue4 = 700;
	pointvalue5 = 600;
	pointvalue6 = 500;
	pointvalue7 = 400;
	pointvalue8 = 350;

	BonusPointTime = 100;

	if(pointcondition1) {
		setTimeout(function(){
		scoreNumber = scoreNumber += pointvalue1;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue1);
		ctx.fillText("+ " + pointvalue1,670,90);

	}
	else if(pointcondition2) {
		setTimeout(function(){
		scoreNumber = scoreNumber += pointvalue2;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue2);
		ctx.fillText("+ " + pointvalue2,670,90);

	}
	else if (pointcondition3) {
		setTimeout(function(){
		scoreNumber = scoreNumber += pointvalue3;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue3);
		ctx.fillText("+ " + pointvalue3,670,90);
	}
	else if (pointcondition4) {
		setTimeout(function(){
		scoreNumber += pointvalue4;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue4);
		ctx.fillText("+ " + pointvalue4,670,90);
	}
	else if (pointcondition5) {
		setTimeout(function(){
		scoreNumber += pointvalue5;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue5);
		ctx.fillText("+ " + pointvalue5,670,90);
	}
	else if (pointcondition6) {
		setTimeout(function(){
		scoreNumber += pointvalue6;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue6);
		ctx.fillText("+ " + pointvalue6,670,90);
	}
	else if (pointcondition7) {
		setTimeout(function(){
		scoreNumber += pointvalue7;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue7);
		ctx.fillText("+ " + pointvalue7,670,90);
	}
	else {
		setTimeout(function(){
		scoreNumber += pointvalue8;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue8);
		ctx.fillText("+ " + pointvalue8,670,90);
	}
}

function keyLoop() {
	var L = 76;

	if (keyState[L] && Game == false) {
		BeginGame();
		Game = true;
	}
	if (keyState[L] && expanding == true && Game == true) {
		Player.width += ExpandSpeed;
		Player.height += ExpandSpeed;
		//IndicatorWidth += ExpandSpeed;
		//IndicatorHeight += ExpandSpeed;
	}
	if (keyState[L] && expanding == false && Game == true) {
		Player.width -= ExpandSpeed;
		Player.height -= ExpandSpeed;
		//IndicatorWidth += ExpandSpeed;
		//IndicatorHeight += ExpandSpeed;
	}

	setTimeout(keyLoop, 40);
}
/*
if (PlayerX <= GoalX - 0.2 && PlayerX >= GoalX + 0.2 && PlayerY <= GoalY - 0.2 && PlayerY >= GoalY + 0.2) {
	}
if (Player.width == GoalWHB[GoalWidthBig] && Player.height == GoalWHB[GoalWidthBig]) {
		win = true;
		setTimeout(function(){ 
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.font = "90px Verdana";
			ctx.fillStyle = "#3366FF";
			ctx.fillText("You Won!",180,300);
		}, 150);
	}
	else {
		setTimeout(function(){ 
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.font = "90px Verdana";
			ctx.fillStyle = "#3366FF";
			ctx.fillText("You've Lost!",150,300);
		}, 100);

	}


*/