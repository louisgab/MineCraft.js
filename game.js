var game = {
    isGenerated  : false,
    canvasWidth  : 1024,
    canvasHeight : 640,
    nbCols       : 16,
    nbRows       : 10,
    tileSize     : 64,
    scale        : 4,
    ground       : 5,
    players      : {},
    map          : {},
    type : ["dirt", "stone"],

    initMap : function(){
        console.log("Generating world...");
        for(var row = 0 ; row < this.nbRows ; row++) {
        this.map[row] = {};
            for(var col = 0 ; col < this.nbCols ; col++) {
                if(row > this.ground){
                    var tile = this.type[Math.floor(Math.random() * 2)];
                    this.addBlock(row, col, tile);
                }
                else{
                    this.addBlock(row, col, "sky");
                }
            }
        }
        this.isGenerated = true;
        console.log("World ready.");
    },

    addBlock : function(row, col, type){
        this.map[row][col] = type;
    },

    updateBlock : function(action, mouse){
        if(action.left){
            this.addBlock(mouse.row, mouse.col, "dirt");
        }
        if(action.right){
            this.removeBlock(mouse.row, mouse.col);
        }
    },

    removeBlock : function(row, col){
        if(this.isSolid(row, col)){
            if(row <= this.ground){

                this.map[row][col] = "sky";
            }
            else{
                this.map[row][col] = "empty";
            }
        }
    },

    isSolid : function(row, col){
        if(this.map[row][col] == "empty" || this.map[row][col] == "sky"){
            return false;
        }
        return true;
    },

    // canJump : function(row, col){
    //
    // },


    addPlayer : function(id, name){
        var newPlayer = {
            id   : id,
            name : name,
            col  : this.nbCols/2,
            row  : Math.floor(this.ground),
            isJumping : false,
            isFalling : false
        }
        this.players[id] = newPlayer;
    },

    isInBounds : function(row, col){
        return (0 <= row && row < this.nbRows && 0 <= col && col < this.nbCols);
    },

    isCollision : function(row, col){
        return (this.isInBounds(row, col) && this.isSolid(row, col));
    },

    canJump : function(row, col){
        return (!this.isCollision(row - 2, col) && !this.isSolid(row, col) && this.isSolid(row + 1, col));
    },

    updatePlayer : function(id, movement){
        var player = this.players[id];
        if (movement.top && this.canJump(player.row, player.col)) {
            player.isJumping = true;
            player.row--;
        }
        if (movement.down && !this.isCollision(player.row + 1, player.col)) {
            player.row++;
        }
        if (movement.left && !this.isCollision(player.row, player.col - 1) && !this.isCollision(player.row - 1, player.col - 1)) {
            player.col--;
        }
        if (movement.right && !this.isCollision(player.row, player.col + 1) && !this.isCollision(player.row - 1, player.col + 1)) {
            player.col++;
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
