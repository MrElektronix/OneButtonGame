window.addEventListener("load", function(){
	function GotoGame() {
		window.location.href = "OneButton.html";
	}
	var StartGameButton = document.getElementById('StartGame');
	StartGameButton.addEventListener('click', GotoGame);

	function GotoTutorial() {
		window.location.href = "Tutorial.html";
	}
	var Tutorial = document.getElementById('Tutorial');
	Tutorial.addEventListener('click', GotoTutorial);

	function GotoUsertest() {
		window.location.href = "Usertest.html";
	}
	var Usertest = document.getElementById('Usertest');
	Usertest.addEventListener('click', GotoUsertest);



	document.oncontextmenu = RightMouseDown;
	document.onmousedown = mouseDown; 

	function mouseDown(e) {
		if (e.which==3) {//righClick
			alert("No right clicking for you");
		}
	}
function RightMouseDown() { return false;}

});
