var CANVAS_WIDTH  = 1024,
    CANVAS_HEIGHT = 800,
    TILE_SIZE     = 32,
    NB_ROWS       = CANVAS_HEIGHT / TILE_SIZE,
    NB_COLS       = CANVAS_WIDTH / TILE_SIZE,
    NB_TILES      = NB_ROWS * NB_COLS;
    GROUND        = NB_ROWS / 2;

var movement = {
    up   : false,
    down : false,
    left : false,
    right: false
}

var socket  = io.connect('http://localhost:8080'),
    canvas  = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    pseudo;

/* Ask pseudo and init */
window.onload = function() {
    canvas.width  = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    while(!pseudo){
        pseudo = prompt('Quel est votre pseudo ?');
    }
    socket.emit('join', pseudo);
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGrid();
}

// Track keyboard
document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 38: movement.top   = true; break;
        case 40: movement.down  = true; break;
        case 37: movement.left  = true; break;
        case 39: movement.right = true; break;
    }
    socket.emit('move', movement);
});
document.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 38: movement.top   = false; break;
        case 40: movement.down  = false; break;
        case 37: movement.left  = false; break;
        case 39: movement.right = false; break;
    }
});

/* Update canvas */
socket.on('update', function(data) {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawMap(data.map);
    drawPlayers(data.players);
});

function drawGrid(){
    for(var row = 0 ; row <= CANVAS_WIDTH; row += TILE_SIZE) {
        context.moveTo(row, 0);
        context.lineTo(row, CANVAS_HEIGHT);
    }
    for(var col = 0 ; col <= CANVAS_HEIGHT; col += TILE_SIZE) {
        context.moveTo(0, col);
        context.lineTo(CANVAS_WIDTH, col);
    }
    context.strokeStyle = "#333";
    context.stroke();
}
function drawMap(map){
    // for(var row = 0 ; row < NB_ROWS ; row++) {
	// 	for(var col = 0 ; col < NB_COLS col++) {
    //         if(map[row][col]){
    //             this.drawBlock(context, row, col);
    //         }
	// 	}
	// }
    // var xSourceEnTiles = id % TILE_SIZE;
    // if(xSourceEnTiles == 0) xSourceEnTiles = TILE_SIZE;
    // var ySourceEnTiles = Math.ceil(id / TILE_SIZE);
    //
    // var xSource = (xSourceEnTiles - 1) * 32;
    // var ySource = (ySourceEnTiles - 1) * 32;
    // context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);

}

function drawPlayers(players){
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id],
            tileCol = player.col * TILE_SIZE,
            tileRow = player.row * TILE_SIZE,
            coords = "("+tileCol+","+tileRow+")";
        console.log(coords);
        context.fillRect(tileCol, tileRow, TILE_SIZE, TILE_SIZE);
        context.font='12px "Press Start 2P"';
        context.fillStyle = 'white';
        context.fillText(player.name, tileCol, tileRow);
        context.fillText(coords, tileCol, tileRow+TILE_SIZE);
    }
}
