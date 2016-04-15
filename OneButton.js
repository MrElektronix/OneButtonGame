window.addEventListener("load", function() {

	document.oncontextmenu=RightMouseDown;
	document.onmousedown = mouseDown; 

	function mouseDown(e) {
		if (e.which==3) { //righClick
			alert("No right clicking for you");
		}
	}
	     function RightMouseDown() { return false;}
	
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
	canvas.width = screen.width;
	canvas.height = screen.height;

	Initialize();

	var StartText = "Press SpaceBar to begin";
	PositionText(StartText);

	//ObjectChosen = Math.floor(Math.random() * 3);

});

var Player = {
	width: 100,
	height: 100
}

function Initialize() {
	allowChange = true;
	expanding = false;
	Game = false;
	ExpandSpeed = 1.5;
	ShrinkSpeed = 1.3;
	scoreNumber = 0;
	Timer = 60;
	shrinkIntervalTime = 50;
	DrawingIntervalTime = 13;
	moveNumber = (DrawingIntervalTime * 50);
	Space = true;
	RestartTimer = 8;
	keyLoop();

	ctx.font = "40px Arial";
	ctx.fillStyle = 'white';
	gameMusic = new Audio('game-music-2.wav');

	ColorList = ["orange", "violet", "purple"];
	PlayerColor = Math.floor(Math.random()*ColorList.length);

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

	direction = -1;
	distanceX = PlayerX - GoalX;
	distanceY = PlayerY - GoalY;
}

function BeginGame() {
	canvas.style.visibility = "visible";
	setInterval(function(){
		if (Timer == 0){
			Timer = 0;
			EndGame();
			Game = false;
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
	ctx.fillText(EndText,750,400);

	var Endscore = "Je eind score is: " + scoreNumber + " punten";
	ctx.fillText(Endscore,750,450);

	var ResTimer = "Je kan opnieuw spelen in: " + RestartTimer + " seconden";
	PositionText(ResTimer);
	RestartTimer--;

	Space = false;
	setTimeout(function(){
		location.reload();
		Space = true;
	}, ((RestartTimer * 1000) + 500))
}

function MakePlayer() {
	ctx.fillStyle = (ColorList[PlayerColor]);
	ctx.fillRect(PlayerX, PlayerY, Player.width, Player.height);
}

function MakeGoal(GoalX, GoalY, GoalWidth, GoalHeight) {
	ctx.fillStyle = 'white';
	ctx.fillRect(GoalX, GoalY, GoalWidth, GoalHeight);
}

function Attributes() {
	ScoreX = window.innerWidth - (2.5 * 100);
	var Score = "Score: " + scoreNumber;
	ctx.fillText(Score,ScoreX,50);

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
	}
	if(expanding == false) {
		Player.width += ShrinkSpeed;
		Player.height += ShrinkSpeed;
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
    if (allowChange == true && direction == -1 && PlayerX >= GoalX - 0.1 && PlayerX <= GoalX + 0.1 && PlayerY >= GoalY - 0.1 && PlayerY <= GoalY + 0.1) {
    	bonusPoint();
    	allowChange = false;
		setTimeout(function(){
		allowChange = true;
		littleX = Math.floor((Math.random()*((canvas.width / 2))) + 550);
		littleY = Math.floor((Math.random()*(600) + 50));
		direction = 1;
		changeGoal(littleX,littleY,GoalWidthSmall[GoalWHS],GoalWidthSmall[GoalWHS]);
		distanceX = GoalX - PlayerX;
		distanceY = GoalY - PlayerY;
		}, 0);
	}
	else if (direction == -1) {
        expanding = true;
		movePlayer((distanceX / moveNumber),(distanceY / moveNumber));
	}

	if (allowChange == true && direction == 1 && PlayerX >= GoalX - 0.1 && PlayerX <= GoalX + 0.1 && PlayerY >= GoalY - 0.1 && PlayerY <= GoalY + 0.1) {
		bonusPoint();
		allowChange = false;
		setTimeout(function(){
		allowChange = true;
		bigX = Math.floor((Math.random()*((canvas.width / 2) - 350)) + 50);
		bigY = Math.floor((Math.random()*(600) + 50));
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
	//console.log("Change Log");
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
	BonusPointTime = 400;
	Check1 = Player.width - GoalWidth;
	Check2 = Player.height - GoalHeight;
	//console.log("Check11: " + Check1);

	if (Check1 < 1 || Check2 < 1) {
		Check1 *= -1;
		Check2 *= -1;
	}
	//console.log("Check12: " + Check1);
	if (Check1 <= 10 || Check2 <= 10) {
		setTimeout(function(){
			scoreNumber = scoreNumber += 900;
			//Attributes();
		}, BonusPointTime);
	}
	else if (Check1 <= 20 || Check2 <= 20) {
		setTimeout(function(){
			scoreNumber = scoreNumber += 800;
		}, BonusPointTime);
	}
	else if (Check1 <= 30 || Check2 <= 30) {
		setTimeout(function(){
			scoreNumber = scoreNumber += 700;
		}, BonusPointTime);
	}
	else if (Check1 <= 40 || Check2 <= 40) {
		setTimeout(function(){
			scoreNumber = scoreNumber += 600;
		}, BonusPointTime);
	}
	else if (Check1 <= 50 || Check2 <= 50) {
		setTimeout(function(){
			scoreNumber = scoreNumber += 500;
		}, BonusPointTime);
	}
	else if (Check1 <= 60 || Check2 <= 60) {
		setTimeout(function(){
			scoreNumber = scoreNumber += 400;
		}, BonusPointTime);
	}
	else {
		setTimeout(function(){
			scoreNumber = scoreNumber += 250;
		}, BonusPointTime);
	}
}

function keyLoop() {
	var SpaceBar = 32;

	if (keyState[SpaceBar] && Game == false && Space == true) {
		BeginGame();
		Game = true;
	}
	if (keyState[SpaceBar] && expanding == true && Game == true && Space == true) {
		Player.width += ExpandSpeed;
		Player.height += ExpandSpeed;
	}
	if (keyState[SpaceBar] && expanding == false && Game == true && Space == true) {
		Player.width -= ExpandSpeed;
		Player.height -= ExpandSpeed;
	}

	setTimeout(keyLoop, 20);
}

window.onkeydown = function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        return false;
    }
};