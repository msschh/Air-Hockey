window.onload = function(){

	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	backgroundColorString = "#eee";
	var sessionStorageP = false;
	
	if (typeof(Storage) !== "undefined") 
	{
		sessionStorageP = true;
	} 

	if( sessionStorageP == false )
	{
		document.getElementById("score").innerHTML = "Cannot display score because your browser is stupid. Do something about that!!";
	}
	else 
	{
		if (sessionStorage.getItem("score1") === null || sessionStorage.getItem("score2") === null) 
		{
			sessionStorage.setItem("score1", 0);
			sessionStorage.setItem("score2", 0);

			var timer = setTimeout(function(){
				sessionStorage.setItem("name1", "Player1");
				sessionStorage.setItem("name2", "Player2");
				myWindow.close();
				continua();
				alert("Because you couldn't choose a name, we decided to do it for you!");
			}, 10000);

			myWindow = window.open("", "", "width = 400, height = 400, top = 100, left = 500");
			myWindow.document.body.style.backgroundColor = 'blue';
			myWindow.document.title = "Air Hockey";
			var par1 = myWindow.document.createElement("p");
			var tar1 = myWindow.document.createTextNode("Chose a name for Player1:");
			par1.appendChild(tar1);
			myWindow.document.body.appendChild(par1);
			var text1 = myWindow.document.createElement("INPUT");
			myWindow.document.body.appendChild(text1);
			var par2 = myWindow.document.createElement("p");
			var tar2 = myWindow.document.createTextNode("Chose a name for Player2:");
			par2.appendChild(tar2);
			myWindow.document.body.appendChild(par2);
			var text2 = myWindow.document.createElement("INPUT");
			myWindow.document.body.appendChild(text2);
			var next = myWindow.document.createElement("BR");
			myWindow.document.body.appendChild(next);
			var btn = myWindow.document.createElement("BUTTON");
			var t = myWindow.document.createTextNode("Submit names!");
			btn.appendChild(t);
			myWindow.document.body.appendChild(btn);
			btn.onclick = function(){
				sessionStorage.setItem("name1", text1.value);
				sessionStorage.setItem("name2", text2.value);
				myWindow.close();
				clearTimeout(timer);
				continua();
			}
		}
		else{
			continua();
		}
	}
}

var canvas;
var ctx;
var winner = 0;
var backgroundColorString;

function continua(){
	var pnou = document.createElement("p");
	var tnou = document.createTextNode(sessionStorage.getItem("name1") + " " + sessionStorage.getItem("score1"));
	var pnou2 = document.createElement("p");
	var tnou2 = document.createTextNode(sessionStorage.getItem("name2") + " " + sessionStorage.getItem("score2"));
   	if(sessionStorage.getItem("score1") > sessionStorage.getItem("score2")){
   		pnou.style.color = "green";
   		pnou2.style.color = "red";
   	}
	else{
  		if(sessionStorage.getItem("score1") < sessionStorage.getItem("score2")){
	   		pnou.style.color = "red";
	  		pnou2.style.color = "green";
	   	}
   	}
   	pnou.classList.add("scor");
   	pnou2.classList.add("scor");
   	pnou.appendChild(tnou);
   	var b = document.getElementById("butoane");
   	document.body.insertBefore(pnou, b);
   	pnou2.appendChild(tnou2);
   	document.body.insertBefore(pnou2, b);
   	$(".scor").css({"margin-left": "46%"});
	
	var b1 = document.getElementById("buton1");
	b1.onclick = function(){
		start();
	}

	var b2 = document.getElementById("buton2");
	b2.onclick = function(){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
		    if (this.readyState == 4 && this.status == 200){
				var col = this.responseText.split("\n");
				document.body.style.backgroundColor = col[Math.floor(Math.random() * (col.length - 1))];
		    }
		};
		xhttp.open("GET", "choosebackground.txt", true);
		xhttp.send();
	}
}

function start(){
	
	game(function(){
		if(winner == 1){
			sessionStorage.setItem("score1", Number(sessionStorage.getItem("score1")) + 1);
			alert(sessionStorage.getItem("name1") + " is the winner!");
		}
		else{
			sessionStorage.setItem("score2", Number(sessionStorage.getItem("score2")) + 1);
			alert(sessionStorage.getItem("name2") + " is the winner!");
		}
		window.location.reload();
	});

}

function game(callback){

	var ballx = canvas.width / 2;
	var bally = canvas.height / 2;
	var ballRadius = 5;
	var ballSpeed = 1;
	var dx = ballSpeed;
	var dy = -ballSpeed;
	var nrAtingeri = 0;

	var playerRadius = 13;
	var playerSpeed = 5;
	var player1x = 13;
	var player1y = 75;
	var player2x = 287;
	var player2y = 75;

	var totGate = canvas.height / 3;
	var botGate = 2 * canvas.height / 3;

	function drawPlayers(){
		ctx.beginPath();
		ctx.arc(player1x, player1y, playerRadius, 0, Math.PI*2, false);
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(player2x, player2y, playerRadius, 0, Math.PI*2, false);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	}

	function drawBall(){
		ctx.beginPath();
		ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	}

	function drawField(){
		ctx.beginPath();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = backgroundColorString;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.width / 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, totGate);
		ctx.lineTo(0, botGate);
		ctx.strokeStyle = "#8f008c";
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(canvas.width, totGate);
		ctx.lineTo(canvas.width, botGate);
		ctx.stroke();
		ctx.strokeStyle = "#8f008c";
	}

	function draw(){
		if(winner){
			clearInterval(t);
			setTimeout(function(){
				callback();
			},300);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawField();
		    drawPlayers();
			drawBall();
		}

		if(nrAtingeri >= 20){
			if(dx > 0){
				dx++;
			}
			else{
				dx--;
			}
			if(dy > 0){
				dy++;
			}
			else{
				dy--;
			}
			
			nrAtingeri = 0;
			if(backgroundColorString == "#eee"){
				backgroundColorString = "#b19252";
			}
			else{
				backgroundColorString = "#eee";
			}
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawField();
	    drawPlayers();
		drawBall();
		if(Math.hypot((ballx - player1x), (bally - player1y)) <= (ballRadius + playerRadius - 1)){
			if(ballx >= player1x - 4 && ballx <= player1x + 4){
				dy = -dy;
			}
			else{
				if(bally >= player1y - 4 && bally <= player1y + 4){
					dx = -dx;
				}
				else{
					dx = -dx;
					dy = -dy;
				}
			}
			ballx += 6 * dx;
			bally += 6 * dy;
			nrAtingeri++;
		}
		if(Math.hypot((ballx - player2x), (bally - player2y)) <= (ballRadius + playerRadius - 1)){
			if(ballx >= player2x - 4 && ballx <= player2x + 4){
				dy = -dy;
			}
			else{
				if(bally >= player2y - 4 && bally <= player2y + 4){
					dx = -dx;
				}
				else{
					dx = -dx;
					dy = -dy;
				}
			}
			ballx += dx;
			bally += dy;
			nrAtingeri++;
		}

		if(bally + dy > canvas.height - ballRadius){
			dy = -dy;
			bally = canvas.height - ballRadius;
		}
		else{
			if(bally + dy < ballRadius){
				dy = -dy;
				bally = ballRadius;
			}
			else{
				bally += dy;
			}
		}

		if(ballx + dx > canvas.width - ballRadius){
			dx = -dx;
			ballx = canvas.width - ballRadius;
			if(bally - ballRadius / 2 > totGate && bally + ballRadius / 2 < botGate){
				winner = 1;
			}
		}
		else{
			if(ballx + dx < ballRadius){
				dx = -dx;
				ballx = ballRadius;
				if(bally - ballRadius / 2 > totGate && bally + ballRadius / 2 < botGate){
					winner = 2;
				}
			}
			else{
				ballx += dx;
			}
		}
	}

	var t = setInterval(draw, 10);

	var map = {};

	window.onkeydown = function(e){
		e = e || event;
		map[e.keyCode] = e.type == 'keydown';

		if(map[38] && map[37]){//stanga-sus
			if(player2y - playerRadius >= playerSpeed){
				player2y -= playerSpeed;
			}
			else{
				player2y = playerRadius;
			}
			if(player2x - playerRadius >= canvas.width / 2 + playerSpeed){
				player2x -= playerSpeed;
			}
			else{
				player2x = canvas.width / 2 + playerRadius;
			}
		}
		if(map[38] && map[39]){//dreapta-sus
			if(player2y - playerRadius >= playerSpeed){
				player2y -= playerSpeed;
			}
			else{
				player2y = playerRadius;
			}
			if(player2x + playerRadius <= canvas.width - playerSpeed){
				player2x += playerSpeed;
			}
			else{
				player2x = canvas.width - playerRadius;
			}
		}
		if(map[40] && map[37]){//stanga-jos
			if(player2y + playerRadius <= canvas.height - playerSpeed){
				player2y += playerSpeed;
			}
			else{
				player2y = canvas.height - playerRadius;
			}
			if(player2x - playerRadius >= canvas.width / 2 + playerSpeed){
				player2x -= playerSpeed;
			}
			else{
				player2x = canvas.width / 2 + playerRadius;
			}
		}
		if(map[40] && map[39]){//dreapta-jos
			if(player2y + playerRadius <= canvas.height - playerSpeed){
				player2y += playerSpeed;
			}
			else{
				player2y = canvas.height - playerRadius;
			}
			if(player2x + playerRadius <= canvas.width - playerSpeed){
				player2x += playerSpeed;
			}
			else{
				player2x = canvas.width - playerRadius;
			}
		}
		if(map[38] && !map[37] && !map[39]){//sus
			if(player2y - playerRadius >= playerSpeed){
				player2y -= playerSpeed;
			}
			else{
				player2y = playerRadius;
			}
		}
		if(map[37] && !map[38] && !map[40]){//stanga
			if(player2x - playerRadius >= canvas.width / 2 + playerSpeed){
				player2x -= playerSpeed;
			}
			else{
				player2x = canvas.width / 2 + playerRadius;
			}
		}
		if(map[40] && !map[37] && !map[39]){//jos
			if(player2y + playerRadius <= canvas.height - playerSpeed){
				player2y += playerSpeed;
			}
			else{
				player2y = canvas.height - playerRadius;
			}
		}
		if(map[39] && !map[38] && !map[40]){//dreapta
			if(player2x + playerRadius <= canvas.width - playerSpeed){
				player2x += playerSpeed;
			}
			else{
				player2x = canvas.width - playerRadius;
			}
		}

		if(map[87] && map[65]){//a-w
			if(player1y - playerRadius >= playerSpeed){
				player1y -= playerSpeed;
			}
			else{
				player1y = playerRadius;
			}
			if(player1x - playerRadius >= playerSpeed){
				player1x -= playerSpeed;
			}
			else{
				player1x = playerRadius;
			}
		}
		if(map[87] && map[68]){//d-w
			if(player1y - playerRadius >= playerSpeed){
				player1y -= playerSpeed;
			}
			else{
				player1y = playerRadius;
			}
			if(player1x + playerRadius <= canvas.width / 2 - playerSpeed){
				player1x += playerSpeed;
			}
			else{
				player1x = canvas.width / 2 - playerRadius;
			}
		}
		if(map[83] && map[65]){//a-s
			if(player1y + playerRadius <= canvas.height - playerSpeed){
				player1y += playerSpeed;
			}
			else{
				player1y = canvas.height - playerRadius;
			}
			if(player1x - playerRadius >= playerSpeed){
				player1x -= playerSpeed;
			}
			else{
				player1x = playerRadius;
			}
		}
		if(map[83] && map[68]){//d-s
			if(player1y + playerRadius <= canvas.height - playerSpeed){
				player1y += playerSpeed;
			}
			else{
				player1y = canvas.height - playerRadius;
			}
			if(player1x + playerRadius <= canvas.width / 2 - playerSpeed){
				player1x += playerSpeed;
			}
			else{
				player1x = canvas.width / 2 - playerRadius;
			}
		}
		if(map[87] && !map[65] && !map[68]){//w
			if(player1y - playerRadius >= playerSpeed){
				player1y -= playerSpeed;
			}
			else{
				player1y = playerRadius;
			}
		}
		if(map[65] && !map[87] && !map[83]){//a
			if(player1x - playerRadius >= playerSpeed){
				player1x -= playerSpeed;
			}
			else{
				player1x = playerRadius;
			}
		}
		if(map[83] && !map[65] && !map[68]){//s
			if(player1y + playerRadius <= canvas.height - playerSpeed){
				player1y += playerSpeed;
			}
			else{
				player1y = canvas.height - playerRadius;
			}
		}
		if(map[68] && !map[87] && !map[83]){//d
			if(player1x + playerRadius <= canvas.width / 2 - playerSpeed){
				player1x += playerSpeed;
			}
			else{
				player1x = canvas.width / 2 - playerRadius;
			}
		}
	}

	window.onkeyup = function(e){
		e = e || event;
		map[e.keyCode] = e.type == 'keydown';
	}
	
}