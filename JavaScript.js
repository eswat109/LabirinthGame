var ctx = null;
rad = 2;
var gameMap = [  
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 3, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 1, 2, 2, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0,
    0, 0, 1, 0, 0, 0, 3, 0, 5, 0, 5, 0, 1, 0, 1, 0,
    0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
    0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 6, 0, 1, 0,
    0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var tileW = 40, tileH = 40;
var mapW = 16, mapH = 13;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;

var tileEvents = {
    140: foundExit,
    83: foundDeath,
    84: foundDeath,
    30: function(){ drawLever(30);},
    102: function(){ drawLever(102);},
    161: function(){ drawLever(161);},
    106: function (c) { c.placeAt(10, 1); },
    104: function (c) { c.placeAt(8, 1); }
};

function foundDeath() {
    alert("You are dead! Try again!");
    window.location.reload();
};

function foundExit() {
    alert("Congratulations! You Won!");
    window.location.reload();
};

function drawLever(d) {
	switch(d) {
		case 30:
			gameMap[129] = (gameMap[129] == 0 ? 1 : 0);
			gameMap[30] = (gameMap[30] == 3 ? 4 : 3);
			break;
		case 102:
			gameMap[137] = (gameMap[137] == 0 ? 1 : 0);
			gameMap[102] = (gameMap[102] == 3 ? 4 : 3);
			break;
		case 161:
			gameMap[158] = (gameMap[158] == 0 ? 1 : 0);
			gameMap[161] = (gameMap[161] == 3 ? 4 : 3);
			break;
	}
};

function leverChange(){
	
}

function endGame() {
    alert("You Won!");
    window.location.reload();
}

var keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
};

var player = new Character();

var grass = new Image();
grass.src = "grass.png";
var dark = new Image();
dark.src = "darkness.png";
var wall = new Image();
wall.src = "wall.png";
var iPlayer = new Image();
iPlayer.src = "player.png";
var finish = new Image();
finish.src = "finish.png";
var switchOn = new Image();
switchOn.src = "switchOn.png";
var switchOff = new Image();
switchOff.src = "switchOff.png";
var portal = new Image();
portal.src = "portal.png";
var trap = new Image();
trap.src = "trap.png";

function Character() {
    this.tileFrom = [1, 1];
    this.tileTo = [1, 1];
    this.timeMoved = 0;
    this.dimensions = [30, 30];
    this.position = [45, 45];
    this.delayMove = 200;
}

Character.prototype.placeAt = function (x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [((tileW * x) + ((tileW - this.dimensions[0]) / 2)),
    ((tileH * y) + ((tileH - this.dimensions[1]) / 2))];
};
Character.prototype.processMovement = function (t) {
    if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) { return false; }

    if ((t - this.timeMoved) >= this.delayMove) {
        this.placeAt(this.tileTo[0], this.tileTo[1]);

    if (typeof tileEvents[toIndex(this.tileTo[0], this.tileTo[1])] != 'undefined') {
        tileEvents[toIndex(this.tileTo[0], this.tileTo[1])](this);
    }

    }
    else {
        this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
        this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

        if (this.tileTo[0] != this.tileFrom[0]) {
            var diff = (tileW / this.delayMove) * (t - this.timeMoved);
            this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
        }
        if (this.tileTo[1] != this.tileFrom[1]) {
            var diff = (tileH / this.delayMove) * (t - this.timeMoved);
            this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
        }

        this.position[0] = Math.round(this.position[0]);
        this.position[1] = Math.round(this.position[1]);
    }

    return true;
}

function toIndex(x, y) {
    return ((y * mapW) + x);
}

window.onload = function () {
    ctx = document.getElementById('game').getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";

    window.addEventListener("keydown", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) { keysDown[e.keyCode] = true; }
    });
    window.addEventListener("keyup", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) { keysDown[e.keyCode] = false; }
    });
};

function drawGame() {
    if (ctx == null) { return; }

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;

    var sec = Math.floor(Date.now() / 1000);
    if (sec != currentSecond) {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else frameCount++;

    if (!player.processMovement(currentFrameTime)) {
        if (keysDown[38] && player.tileFrom[1] > 0 && gameMap[toIndex(player.tileFrom[0], player.tileFrom[1] - 1)] >= 1) { player.tileTo[1] -= 1; }
        else if (keysDown[40] && player.tileFrom[1] < (mapH - 1) && gameMap[toIndex(player.tileFrom[0], player.tileFrom[1] + 1)] >= 1) { player.tileTo[1] += 1; }
        else if (keysDown[37] && player.tileFrom[0] > 0 && gameMap[toIndex(player.tileFrom[0] - 1, player.tileFrom[1])] >= 1) { player.tileTo[0] -= 1; }
        else if (keysDown[39] && player.tileFrom[0] < (mapW - 1) && gameMap[toIndex(player.tileFrom[0] + 1, player.tileFrom[1])] >= 1) { player.tileTo[0] += 1; }

        if (player.tileFrom[0] != player.tileTo[0] || player.tileFrom[1] != player.tileTo[1])
        { player.timeMoved = currentFrameTime; }
    }

    for (var y = 0; y < mapH; ++y) {
        for (var x = 0; x < mapW; ++x) {
            if(x < player.tileFrom[0] - rad || x > player.tileFrom[0] + rad || y < player.tileFrom[1] - rad || y > player.tileFrom[1] + rad ){
            	ctx.drawImage(dark, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH)}
            else {
                switch (gameMap[((y * mapW) + x)]) {

                    case 0:
                        ctx.drawImage(wall, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH);
                        break;                        
                    case 1:
                        ctx.drawImage(grass, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH);
                        break;
                    case 2: 
                        ctx.drawImage(trap, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH);
                        break;
                    case 3: 
                        ctx.drawImage(switchOff, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH);
                        break;
                    case 4: 
                        ctx.drawImage(switchOn, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH);
                        break;
                    case 5: 
                        ctx.drawImage(portal, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH)
                        break;
                    case 6: 
                        ctx.drawImage(finish, 0, 0, 40, 40, x * tileW, y * tileH, tileW, tileH);
                }
            }
        }
    }
    ctx.drawImage(iPlayer, 0, 0, 30, 30, player.position[0], player.position[1],
        player.dimensions[0], player.dimensions[1]);


    ctx.fillStyle = "#ff0000";
    ctx.fillText("FPS: " + framesLastSecond, 10, 20);

    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);
}
