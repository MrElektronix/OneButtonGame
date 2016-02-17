window.addEventListener("load", function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = 800;
	canvas.height = 800;
	canvas.style.border = "2px solid black";
	MakeOuterObject();
	MakeInnerObject();

	setInterval(function(){Won()}, 20);
	setInterval(function(){ShrinkObject()}, 50);
});
var win = false;
var ExpandSpeed = 10;
var ShrinkSpeed = 2;

var ColorList1 = ["red", "green", "yellow"];
var OuterColor = Math.floor(Math.random()*ColorList1.length);

var ColorList2 = ["orange", "violet", "purple"];
var InnerColor = Math.floor(Math.random()*ColorList2.length);

var InnerObject = {
	width: 100,
	height: 100
}


function MakeInnerObject() {
	x = (canvas.width / 2 - (InnerObject.width / 2));
	y = (canvas.height / 2 - (InnerObject.height / 2));

	ctx.fillStyle = (ColorList2[InnerColor]);
	ctx.fillRect(x, y, InnerObject.width, InnerObject.height);
}

function MakeOuterObject() {
	WH = Math.floor(Math.random()*600) + 200;

	x = (canvas.width / 2 - (WH / 2));
	y = (canvas.height / 2 - (WH / 2));
	ctx.strokeStyle = (ColorList1[OuterColor]);
	ctx.strokeRect(x, y, WH, WH);
}

function ShrinkObject() {
	if (InnerObject.width <= 0 && InnerObject.height <= 0) {
		InnerObject.width = 0;
		InnerObject.height = 0;
	}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	InnerObject.width -= ShrinkSpeed;
	InnerObject.height -= ShrinkSpeed;
	MakeInnerObject();
}

function Won() {
	if (InnerObject.width >= WH && InnerObject.height >= WH) {
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
}

document.onkeyup = function(evt) {
	var Space = 32;
	if (evt.keyCode == Space && win == false) {
		InnerObject.width += ExpandSpeed;
		InnerObject.height += ExpandSpeed;
		MakeInnerObject();
	}

	if (evt.keyCode == Space && win == true) {
		Won();
	}
}
