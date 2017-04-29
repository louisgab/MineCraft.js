var camera ={
    x : 0,
    y : 0,
    maxX : 0,
    maxY : 0,
    screenX : 0,
    screenY : 0,

    /* Move camera */
    update : function () {
        var player = util.currentClient();
        this.screenX = sizer.width / 2;
        this.screenY = sizer.height / 2;
        this.x = player.x - sizer.width / 2;
        this.y = player.y - sizer.height / 2;
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
        if (player.x < sizer.width / 2 ||
            player.x > this.maxX + sizer.width / 2) {
            this.screenX = player.x - this.x;
        }
        if (player.y < sizer.height / 2 ||
            player.y > this.maxY + sizer.height / 2) {
            this.screenY = player.y - this.y;
        }
    },

    /* Check if a map pos is visible by the camera */
    isInside : function(x, y){
        return this.x <= x && x < this.x + sizer.width &&
               this.y <= y && y < this.y + sizer.height;
    },

    /* Start camerization */
    init : function() {
        var player = util.currentClient();
        this.x = player.x - (sizer.width / 2);
        this.y = player.y - (sizer.height / 2);
        this.maxX = client.config.mapCols * client.config.tileSize - sizer.width;
        this.maxY = client.config.mapRows * client.config.tileSize - sizer.height;
    }
};
