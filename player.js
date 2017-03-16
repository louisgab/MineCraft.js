var  players = [];

function Player(id, name){
    this.id = id;
    this.name = name;
    this.x = 0;
    this.y = 0;
}

this.add = function(name){
    var newPlayer = Player(players.length, name);
    players.push(newPlayer);
    return newPlayer;
}

this.updatePosition = function(id, data){
    players[id].x = data.x;
    players[id].y = data.y;
}

this.remove = function(id){
    players.splice(id, 1);
    // TODO: Vérifier que les id des autres joueurs restent inchangés
}
