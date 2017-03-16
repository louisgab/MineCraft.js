var worldWidth = 1024;
var worldHeight = 800;
var blockSize = 32;

var blocks = [
    [0,0,0,0],
    [0,0,0,0],
    [1,1,2,1],
    [1,1,1,1]
];

function Block(x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;
}

this.add = function(x, y, dirt){
    var newBlock = Block(x, y, "dirt");

}

this.updateBlock = function(data){

}
