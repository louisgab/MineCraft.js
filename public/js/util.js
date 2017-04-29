var util = {
    /* Find the nearest multiple of a tile. Must be smaller than the number. */
    findMultiple : function (number){
        var multiple = Math.ceil(number / client.config.tileSize) * client.config.tileSize;
        if(multiple > number) multiple -= client.config.tileSize;
        return multiple;
    },

    /* Convert a pos (x or y) in a tile (col or row) */
    posToTile: function (pos) {
        return Math.floor(pos / client.config.tileSize);
    },

    /* Convert a tile (col or row) in a pos (x or y) */
    tileToPos: function (tile) {
        return tile * client.config.tileSize;
    },

    /* Who is this player ? */
    currentClient : function(){
        return client.players[client.id];
    },
};
