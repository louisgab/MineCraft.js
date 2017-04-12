var game = {
    isGenerated : false,
    config      : {},
    players     : {},
    map         : {},

//-------------------------------//   MAP   //-------------------------------//

    /* Generate ground to top part */
    createSky : function(){
        for (var row = 0 ; row < this.config.mapRows ; row++) {
            this.map[row] = {};
            for (var col = 0 ; col < this.config.mapCols ; col++){
                this.map[row][col] = (row > this.config.mapGround) ? "empty" : "sky";
            }
        }
    },

    /* Generate ground to bottom part (with caves !) */
    createUnderground : function (map){
        for (var row = this.config.mapGround + 1 ; row < this.config.mapRows ; row++)
            for (var col = 0 ; col < this.config.mapCols ; col++)
                if (Math.random() < 0.5) map[row][col] = "dirt";
        for(var row = this.config.mapGround + 1 ; row < this.config.mapRows ; row++){
            for(var col = 0; col < this.config.mapCols ; col++){
                var nbs = this.countNeighbours(map, row, col);
                if(map[row][col] == "dirt"){
                    this.map[row][col] = (nbs < 4) ? "empty" : "dirt";
                }
                else if(map[row][col] == "empty"){
                    this.map[row][col] = (nbs > 4) ? "dirt" : "empty";
                }
            }
        }
    },

    /* Generate ground part : grass only */
    createSurface : function(){
        for(var col = 0 ; col < this.config.mapCols ; col++) {
            this.map[this.config.mapGround + 1][col] = "grass";
        }
    },

    createBedrock : function(){
        for(var col = 0 ; col < this.config.mapCols ; col++) {
            this.map[this.config.mapRows - 1][col] = "bedrock";
        }
    },

    /* Count solid blocks and bounds */
    countNeighbours : function (map, row, col){
        var count = 0;
        for(var i = -1 ; i < 2 ; i++){
            for(var j = -1 ; j < 2 ; j++){
                if(i === 0 && j === 0) continue;
                var nb_row = i + row, nb_col = j + col;
                var isBoundRow = nb_row < 0 || nb_row >= this.config.mapRows;
                var isBoundCol = nb_col < 0 || nb_col >= this.config.mapCols;
                if(isBoundRow || isBoundCol || map[nb_row][nb_col] == "dirt") count++;
            }
        }
        return count;
    },

    /* Init and generate all the map */
    generate : function(config){
        this.config = config;
        console.log("Generating world...");
        this.createSky();
        this.createUnderground(this.map);
        this.createSurface();
        this.createBedrock();
        this.isGenerated = true;
        console.log("World ready.");
    },

    /* Add a block */
    addBlock : function(row, col, type){
        this.map[row][col] = type;
    },

    /* Remove a block */
    removeBlock : function(row, col){
        if(this.isSolid(row, col)){
            if(row <= this.config.mapGround){
                this.map[row][col] = "sky";
            }
            else{
                this.map[row][col] = "empty";
            }
        }
    },

    /* Check if a tile a solid, so walkable or not */
    isSolid : function (row, col) {
        switch(this.map[row][col]){
            case "empty": return false;
            case "sky":   return false;
            default:      return true;
        }
    },

//-----------------------------//   PLAYERS   //-----------------------------//

    /* Create a player object and add it to the list */
    addPlayer : function(id, name){
        this.players[id] = {
            id   : id,
            name : name,
            x  : this.tileToPos(this.config.mapCols/2),
            y  : this.tileToPos(this.config.mapRows/2)
        };
    },

    /* Check if a tile is inside the map */
    isInBounds : function(row, col){
        return (0 <= row && row < this.config.mapRows && 0 <= col && col < this.config.mapCols);
    },



    /* Check if the player can go upside (need to falls afterwards...) */
    canJump : function(row, col){
        return this.isInBounds(row - 2, col) && !this.isSolid(row - 2, col) &&
               (!this.isInBounds(row + 1, col) || (this.isInBounds(row + 1, col) && this.isSolid(row + 1, col)));
    },

    /* Check if the player can go downside */
    canGoDown : function(row, col){
        return this.isInBounds(row + 1, col) && !this.isSolid(row + 1, col);
    },

    /* Check if the player can go leftside */
    canGoLeft : function(row, col){
        return this.isInBounds(row, col - 1) && !this.isSolid(row, col - 1) &&
               this.isInBounds(row - 1, col - 1) && !this.isSolid(row - 1, col - 1);
    },

    /* Check if the player can go rightside */
    canGoRight : function(row, col){
        return this.isInBounds(row, col + 1) && !this.isSolid(row, col + 1) &&
               this.isInBounds(row - 1, col + 1) && !this.isSolid(row - 1, col + 1);
    },

    /* Move the player when possible */
    updatePlayer : function(id, keyboard){
        var player = this.players[id],
            row = this.posToTile(player.y),
            col = this.posToTile(player.x);
        if (keyboard.up && this.canJump(row, col)){
            player.y -= this.config.tileSize;
        }
        if (keyboard.down && this.canGoDown(row, col)){
            player.y += this.config.tileSize;
        }
        if (keyboard.left){
            if(this.canGoLeft(row, col)){
                player.x -= this.config.tileSize;
            }
            else if (this.canGoLeft(row - 1, col - 1)) {
                player.x -= this.config.tileSize;
                player.y -= this.config.tileSize;
            }
        }
        if (keyboard.right){
            if(this.canGoRight(row, col)){
                player.x += this.config.tileSize;
            }
            else if (this.canGoRight(row - 1, col + 1)) {
                player.x += this.config.tileSize;
                player.y -= this.config.tileSize;
            }
        }
        if(!keyboard.up){
            this.checkFall(player);
        }
    },

    checkFallEverybody : function(row, col){
        var flag = false;
        for (var id in this.players){
            var player = this.players[id],
                playerRow = this.posToTile(player.y),
                playerCol = this.posToTile(player.x);
            if(row == (playerRow + 1) && col == playerCol){
                flag = this.checkFall(player);
            }
        }
        return flag;

    },

    checkFall : function(player){
        var playerRow = this.posToTile(player.y),
            playerCol = this.posToTile(player.x),
            flag = false;
        while(this.isInBounds(playerRow + 1, playerCol) && !this.isSolid(playerRow + 1, playerCol)){
            flag = true;
            player.y += this.config.tileSize;
            playerRow = this.posToTile(player.y);
        }
        return flag;
    },

    /* Retrieve a client name */
    getPlayerPseudo : function(id){
        return this.players[id].name;
    },

    /* Delete a client from the list */
    removePlayer : function(id){
        delete this.players[id];
    },

//------------------------------//   UTILS   //------------------------------//

    /* Convert a pos (x or y) in a tile (col or row) */
    posToTile: function (pos) {
        return Math.floor(pos / this.config.tileSize);
    },

    /* Convert a tile (col or row) in a pos (x or y) */
    tileToPos: function (tile) {
        return tile * this.config.tileSize;
    }
};
module.exports = game;
