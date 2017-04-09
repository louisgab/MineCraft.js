var util = {
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
    }
}
