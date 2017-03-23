var game = {
    isGenerated  : false,
    tileSize     : 32,
    canvasWidth  : 1024,
    canvasHeight : 800,
    nbRows       : 0,
    nbCols       : 0,
    ground       : 0,
    players      : {},
    blocks       : {},

    initMap : function(){
        console.log("Generating world...");
        this.nbRows = this.canvasHeight / this.tileSize;
        this.ground = this.nbRows/2;
        this.nbCols = this.canvasWidth / this.tileSize;
        this.isGenerated = true;
        for(var row = 0 ; row < this.nbRows ; row++) {
            this.blocks[row] = {};
        		for(var col = 0 ; col < this.nbCols ; col++) {
                if(row > this.ground){
                  this.addBlock(row, col, "dirt");
                }
        		}
  	     }
         console.log(this.blocks);
         console.log("World ready.");
    },

    addBlock : function(row, col, type){
        var newBlock = {
            row  : row,
            col  : col,
            type : type
        }
        this.blocks[row][col] = newBlock;
    },

    removeBlock : function(row, col){
        delete blocks[row][col];
    },

    addPlayer : function(id, name){
        var newPlayer = {
            id   : id,
            name : name,
            col  : 0,
            row  : 0
        }
        this.players[id] = newPlayer;
    },

    updatePlayer : function(id, movement){
        if (movement.top && this.players[id].row > 0) {
            this.players[id].row--;
        }
        if (movement.down && this.players[id].row < this.nbRows - 1) {
            this.players[id].row++;
        }
        if (movement.left && this.players[id].col > 0) {
            this.players[id].col--;
        }
        if (movement.right && this.players[id].col < this.nbCols - 1) {
            this.players[id].col++;
        }
    },

    removePlayer : function(id){
        delete this.players[id];
    },

    getPlayerPseudo : function(id){
        return this.players[id].name;
    }
};
module.exports = game;
