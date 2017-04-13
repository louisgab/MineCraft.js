var camera ={
    x : 0,
    y : 0,
    maxX : 0,
    maxY : 0,
    screenX : 0,
    screenY : 0,
    update : function () {
        var player = util.currentClient();
        this.screenX = client.config.cvsWidth / 2;
        this.screenY = client.config.cvsHeight / 2;
        this.x = player.x - client.config.cvsWidth / 2;
        this.y = player.y - client.config.cvsHeight / 2;
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
        if (player.x < client.config.cvsWidth / 2 ||
            player.x > this.maxX + client.config.cvsWidth / 2) {
            this.screenX = player.x - this.x;
        }
        if (player.y < client.config.cvsHeight / 2 ||
            player.y > this.maxY + client.config.cvsHeight / 2) {
            this.screenY = player.y - this.y;
        }
    },

    isInside : function(x, y){
        return this.x <= x && x < this.x + client.config.cvsWidth &&
               this.y <= y && y < this.y + client.config.cvsHeight;
    },

    init : function() {
        var player = util.currentClient();
        this.x = player.x - (client.config.cvsWidth / 2);
        this.y = player.y - (client.config.cvsHeight / 2);
        this.maxX = client.config.mapCols * client.config.tileSize - client.config.cvsWidth;
        this.maxY = client.config.mapRows * client.config.tileSize - client.config.cvsHeight;
    }
}
