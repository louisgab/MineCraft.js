var game = {
    isGenerated  : false,
    tileSize     : 32,
    canvasWidth  : 1024,
    canvasHeight : 800,
    nbRows       : 0,
    nbCols       : 0,
    players      : {},
    blocks       : {},

    initMap : function(){
        console.log("Generating world...");
        this.nbRows = this.canvasHeight / this.tileSize;
        this.nbCols = this.canvasWidth / this.tileSize;
        this.isGenerated = true;
        console.log("World ready.");
        // for(var row = 0 ; row < this.nbRows ; row++) {
        //     this.blocks[row] = {};
    	// 	for(var col = 0 ; col < this.nbCols ; col++) {
        //         // if(row > this.ground){
        //         //     this.blocks[row][col] = this.addBlock(x, y, "dirt");
        //         // }
        //         // else{
        //         //     this.blocks[row][col] = ""; // sky ?
        //         // }
    	// 	}
    	// }
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
