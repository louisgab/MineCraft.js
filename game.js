var  players = {};

function Player(id, name){
    this.id   = id;
    this.name = name;
    this.x    = 0;
    this.y    = 0;
}

this.addPlayer = function(id, name){
    var newPlayer = new Player(id, name);
    players[id] = newPlayer;
}

this.getPlayerPseudo = function(id){
    return players[id].name;
}

this.getState = function(id){
    return players;
}

this.updatePlayer = function(id, movement){
    if (movement.top) {
        players[id].y--;
    }
    if (movement.down) {
        players[id].y++;
    }
    if (movement.left) {
        players[id].x--;
    }
    if (movement.right) {
        players[id].x++;
    }
}

this.removePlayer = function(pseudo){
    delete players[pseudo];
}
