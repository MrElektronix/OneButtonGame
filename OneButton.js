window.addEventListener("load", function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = 800;
	canvas.height = 800;
	//canvas.style.border = "2px solid black";
	Initialize();
	MakeOuterObject();
	MakeInnerObject();

	setInterval(function(){draw()}, 20);
	//setInterval(function(){update()}, 20);
	setInterval(function(){ShrinkObject()}, 50);
});

var InnerObject = {
	width: 100,
	height: 100
}

function Initialize() {
	ExpandSpeed = 10;
	ShrinkSpeed = 2;
	MoveSpeed = 1;
	win = false;

	ColorList1 = ["red", "green"];
	OuterColor = Math.floor(Math.random()*ColorList1.length);

	ColorList2 = ["orange", "violet", "purple"];
	InnerColor = Math.floor(Math.random()*ColorList2.length);

	OuterWidths = [100, 150, 200, 250];
	OuterWH = Math.floor(Math.random()*OuterWidths.length);
		
	InnerX = 600;
	InnerY = 600;
	OuterX = 50;
	OuterY = 50;
}

function MakeInnerObject() {
	ctx.fillStyle = (ColorList2[InnerColor]);
	ctx.fillRect(InnerX, InnerY, InnerObject.width, InnerObject.height);
}

function MakeOuterObject() {
	ctx.strokeStyle = (ColorList1[OuterColor]);
	ctx.strokeRect(OuterX, OuterY, OuterWidths[OuterWH], OuterWidths[OuterWH]);
}

function ShrinkObject() {
	if (InnerObject.width <= 0 && InnerObject.height <= 0) {
		InnerObject.width = 0;
		InnerObject.height = 0;
	}

	if (win == false) {
		InnerObject.width -= ShrinkSpeed;
		InnerObject.height -= ShrinkSpeed;
	}
}

function update() {
	if (InnerObject.width == OuterWH[OuterWidths] && InnerObject.height == OuterWH[OuterWidths]) {
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
}

function draw() {
	if (InnerY != OuterY && InnerX != OuterX) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		InnerX = (InnerX -= MoveSpeed);
		InnerY = (InnerY -= MoveSpeed);
		MakeInnerObject();
		MakeOuterObject();
	}
	else {
		update();
	}

	
}

document.onkeyup = function(evt) {
	var Space = 32;
	if (evt.keyCode == Space && win == false) {
		InnerObject.width += ExpandSpeed;
		InnerObject.height += ExpandSpeed;
	}

	if (evt.keyCode == Space && win == true) {
		Won();
	}
}
