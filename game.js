// ---------------- // MAP // ---------------- //
var CANVAS_WIDTH  = 1024,
    CANVAS_HEIGHT = 800,
    TILE_SIZE     = 32,
    NB_ROWS       = CANVAS_HEIGHT / TILE_SIZE,
    NB_COLS       = CANVAS_WIDTH / TILE_SIZE,
    NB_TILES      = NB_ROWS * NB_COLS,
    GROUND        = NB_ROWS / 2;

var map     = {},
    players = {};

this.generateMap = function(){
    for(var row = 0 ; row < NB_ROWS ; row++) {
        map[row] = [];
		for(var col = 0 ; col < NB_COLS ; col++) {
            if(row > GROUND){
                this.addBlock(x, y, "dirt");
            }
            else{
                map[row][col] = ""; // sky ?
            }
		}
	}
}

this.getMap = function(){
    return map;
}

this.posToGrid = function(x, y) {
    return { row : x / TILE_SIZE, col : y / TILE_SIZE };
}

// ---------------- // BLOCKS // ---------------- //

function Block(row, col, type){
    this.row  = row;
    this.col  = col;
    this.type = type;
}

this.addBlock = function(row, col, type){
    var newBlock = new Block(row, col, type);
    map[row][col] = newBlock;
}

this.removeBlock = function(row, col){
    delete map[row][col];
}


// ---------------- // PLAYERS // ---------------- //
function Player(id, name){
    this.id   = id;
    this.name = name;
    this.col  = 0;
    this.row  = 0;
}

this.addPlayer = function(id, name){
    var newPlayer = new Player(id, name);
    players[id] = newPlayer;
}

this.updatePlayer = function(id, movement){
    if (movement.top && players[id].row > 0) {
        players[id].row--;
    }
    if (movement.down && players[id].row < NB_ROWS - 1) {
        players[id].row++;
    }
    if (movement.left && players[id].col > 0) {
        players[id].col--;
    }
    if (movement.right && players[id].col < NB_COLS - 1) {
        players[id].col++;
    }
}

this.removePlayer = function(pseudo){
    delete players[pseudo];
}

this.getPlayerPseudo = function(id){
    return players[id].name;
}

this.getPlayers = function(){
    return players;
}
