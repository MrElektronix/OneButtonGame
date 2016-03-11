window.addEventListener("load", function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = 800;
	canvas.height = 800;

	Initialize();

	ctx.font = "40px Arial";
	var StartText = "Press L to begin (and to play with)";
	ctx.fillText(StartText,80,400);

	setInterval(function(){
		if (Timer == 0){
			Timer = 0;
			EndGame();
		}
		else {
			Timer--;
		}
	}, 1000);
});

var Player = {
	width: 100,
	height: 100
}
function BeginGame() {
	gameMusic.play();
	Drawing = setInterval(function(){draw()}, 20);
	Shrinking = setInterval(function(){ChangeObject()}, shrinkIntervalTime);

}

function EndGame() {
	clearInterval(Drawing);
	clearInterval(Shrinking);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var EndText = "Je tijd is om";
	ctx.fillText(EndText,250,400);

	var Endscore = "Je eind score is: " + scoreNumber + " punten";
	ctx.fillText(Endscore,100,450);

}

function Initialize() {
	Game = false;
	ExpandSpeed = 10;
	ShrinkSpeed = 1.3;
	moveNumber = 200;
	scoreNumber = 0;
	Timer = 20;
	shrinkIntervalTime = 50;
	gameMusic = new Audio('kika.mp3');

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
	IndicatorX = (PlayerX - 5);
	IndicatorY = (PlayerY - 5);
	IndicatorWidth = (Player.width + 10);
	IndicatorHeight = (Player.height + 10);

	direction = -1;
	distanceX = PlayerX - GoalX;
	distanceY = PlayerY - GoalY;
	r = 0;
	g = 255;
	b = 0;
	alpha = 0.2;

}

function MakePlayer() {
	ctx.fillStyle = (ColorList2[PlayerColor]);
	ctx.fillRect(PlayerX, PlayerY, Player.width, Player.height);
}

function MakeGoal(GoalX, GoalY, GoalWidth, GoalHeight) {
	ctx.lineWidth = 1;
	ctx.strokeStyle = (ColorList1[GoalColor]);
	ctx.strokeRect(GoalX, GoalY, GoalWidth, GoalHeight);
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
	ctx.fillText(Score,550,50);

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

function update() {
	scoreNumber += Math.floor(Math.random()*20);
	littleX = Math.floor((Math.random()*((canvas.width / 2))) + 300);
	littleY = 500;

	bigX = Math.floor((Math.random()*((canvas.width / 2) - 400)) + 50);
	bigY = 100;

	//speler is rechts onder het goal en beweest naar links en boven
	if(direction == -1 && PlayerX > GoalX && PlayerY > GoalY)
	{
		expanding = true;
		movePlayer((distanceX / moveNumber),(distanceY / moveNumber));
	}else if(direction == -1)
	{
		//goal geraakt
		//bonusPoint();
		setTimeout(function(){
		direction = 1;
		changeGoal(littleX,littleY,GoalWidthSmall[GoalWHS],GoalWidthSmall[GoalWHS]);
		distanceX = Math.floor(GoalX - PlayerX);
		distanceY = Math.floor(GoalY - PlayerY);
		}, 100);
	}


	if(direction == 1 && PlayerX < GoalX && PlayerY < GoalY)
	{
		expanding = false;
		movePlayer((distanceX / -moveNumber),(distanceY / -moveNumber));
	}else if(direction == 1)
	{
		//bonusPoint();
		setTimeout(function(){
		direction = -1;
		changeGoal(bigX,bigY,GoalWidthBig[GoalWHB],GoalWidthBig[GoalWHB]);
		distanceX = Math.floor(PlayerX - GoalX);
		distanceY = Math.floor(PlayerY - GoalY);
		}, 100);
	}



}


//wanneer? als player vorige goal heeft bereikt
function changeGoal(newX, newY, width, height)
{
	//verander pos en size van goal

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

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	MakeGoal(GoalX, GoalY, GoalWidth, GoalHeight);
	Attributes();
	MakePlayer();
	update();
	
	/*
	if (PlayerX >= GoalX - 0.2 && PlayerX <= GoalX + 0.2 && PlayerY >= GoalY - 0.2 && PlayerY <= GoalY + 0.2) {
		
	}
	if (PlayerX <= GoalX - 0.2 && PlayerX >= GoalX + 0.2 && PlayerY <= GoalY - 0.2 && PlayerY >= GoalY + 0.2) {
	}
	else {

		*/
		
		//IndicatorX = (PlayerX - 5);
		//IndicatorY = (PlayerY - 5);

		//Indicator();
	//}
	//
}

function bonusPoint() {
	pointcondition1 = (Player.width > (GoalWidthBig[GoalWHB] - 10) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 10) && Player.height < GoalWidthBig[GoalWHB]);
	pointcondition2 = (Player.width > (GoalWidthBig[GoalWHB] - 20) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 20) && Player.height < GoalWidthBig[GoalWHB]);
	pointcondition3 = (Player.width > (GoalWidthBig[GoalWHB] - 30) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 30) && Player.height < GoalWidthBig[GoalWHB]);
	pointcondition4 = (Player.width > (GoalWidthBig[GoalWHB] - 40) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 40) && Player.height < GoalWidthBig[GoalWHB]);
	pointcondition5 = (Player.width > (GoalWidthBig[GoalWHB] - 50) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 50) && Player.height < GoalWidthBig[GoalWHB]);
	pointcondition6 = (Player.width > (GoalWidthBig[GoalWHB] - 60) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 60) && Player.height < GoalWidthBig[GoalWHB]);
	pointcondition7 = (Player.width > (GoalWidthBig[GoalWHB] - 70) && Player.width < GoalWidthBig[GoalWHB] && Player.height > (GoalWidthBig[GoalWHB] - 70) && Player.height < GoalWidthBig[GoalWHB]);

	pointvalue1 = 900;
	pointvalue2 = 800;
	pointvalue3 = 700;
	pointvalue4 = 600;
	pointvalue5 = 500;
	pointvalue6 = 400;
	pointvalue7 = 400;

	BonusPointTime = 100;

	if(pointcondition1) {
		setTimeout(function(){
		scoreNumber = scoreNumber += pointvalue1;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue1);
		ctx.fillText("+ " + pointvalue1,670,90);

	}
	else if (pointcondition2) {
		setTimeout(function(){
		scoreNumber = scoreNumber += pointvalue2;
		Attributes();
		}, BonusPointTime);
		console.log(pointvalue2);
		ctx.fillText("+ " + pointvalue2,670,90);
	}
	else if (pointcondition3) {
		setTimeout(function(){
		scoreNumber += pointvalue3;
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
}

document.onkeyup = function(evt) {
	var L = 76;
	if (evt.keyCode == L && Game == false) {
		BeginGame();
		Game = true;
	}
	if (evt.keyCode == L && expanding == true && Game == true) {
		Player.width += ExpandSpeed;
		Player.height += ExpandSpeed;
		IndicatorWidth += ExpandSpeed;
		IndicatorHeight += ExpandSpeed;
	}
	if (evt.keyCode == L && expanding == false && Game == true) {
		Player.width -= ExpandSpeed;
		Player.height -= ExpandSpeed;
		IndicatorWidth -= ExpandSpeed;
		IndicatorHeight -= ExpandSpeed;
	}


	/*
	if (evt.keyCode == L && win == true) {
		Won();
	}
	*/
}
/*
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