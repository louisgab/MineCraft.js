var draw = {
    /* Easy tile draw */
    tile : function(context, block, x, y, width, height){
        if(block == "sky"){
            context.fillStyle = "#8cbeff";
            context.fillRect(x, y, client.config.tileSize, client.config.tileSize);
        }
        else{
            context.drawImage(tiles.get(block), x, y, width * client.config.tileSize, height * client.config.tileSize);
        }
    },

    /* Easy text draw */
    text : function(context, text, align, size, x, y){
        var tilt = (size > 10) ? 2 : 1;
        context.font      = size + 'px Minecraftia';
        context.textAlign = align;
        context.fillStyle = 'rgba(0,0,0,0.8)';
        context.fillText(text, x + tilt, y + tilt);
        context.fillStyle = 'white';
        context.fillText(text, x, y);
    },

    /* Clear then display all tiles */
    map : function(){
        ctxMap.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        var startCol = util.posToTile(camera.x);
        var startRow = util.posToTile(camera.y);
        var endCol = startCol + util.posToTile(client.config.cvsWidth);
        var endRow = startRow + util.posToTile(client.config.cvsHeight);
        var offsetX = util.tileToPos(startCol) - camera.x;
        var offsetY = util.tileToPos(startRow) - camera.y;
        for (var row = startRow ; row < endRow ; row++) {
            for (var col = startCol ; col < endCol ; col++) {
                var tile = client.map[row][col];
                var x = util.tileToPos(col - startCol) + offsetX;
                var y = util.tileToPos(row - startRow) + offsetY;
                draw.tile(ctxMap, tile, Math.round(x), Math.round(y), 1, 1);
            }
        }
        /* Add sun on top right corner */
        var x = client.config.cvsWidth - util.tileToPos(2),
            y = util.tileToPos(1);
        draw.tile(ctxMap, "sun", x, y);
    },

    /* Clear then display all players */
    players : function(){
        ctxPlayers.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        /* Draw myself */
        var currentPlayer = util.currentClient();
        draw.text(ctxPlayers, currentPlayer.name, 'center', '16', camera.screenX + (client.config.tileSize / 2), camera.screenY - client.config.tileSize);
        draw.tile(ctxPlayers, "steve", camera.screenX, camera.screenY - client.config.tileSize, 1, 2);
        /* Draw others */
        for (var id in client.players) {
            var player = client.players[id];
            if(id != currentPlayer.id && camera.isInside(player.x, player.y)){
                draw.text(ctxPlayers, player.name, 'center', '16', player.x - camera.x + (client.config.tileSize / 2), player.y - camera.y - client.config.tileSize);
                draw.tile(ctxPlayers, "alex", player.x - camera.x, player.y - camera.y - client.config.tileSize, 1, 2);
            }
        }
    },

    /* Clear then display cursor selected tile */
    cursor : function(){
        ctxEffects.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        var x = util.tileToPos(control.mouse.col) - camera.x,
            y = util.tileToPos(control.mouse.row) - camera.y;
        ctxEffects.lineWidth   = 4;
        ctxEffects.strokeStyle = (control.click.isValid) ? "rgba(65, 224, 53, 0.5)" : "rgba(224, 53, 53, 0.5)";
        ctxEffects.strokeRect(x, y, client.config.tileSize, client.config.tileSize);
    },

    /* Clear then display item selector and current one */
    selector : function(){
        ctxSelector.clearRect(0, 0, (182 + 2) * client.config.scale, 24 * client.config.scale);
        ctxSelector.drawImage(tiles.get("selector"), 2, 4, 182 * client.config.scale, (24 - 2) * client.config.scale);
        ctxSelector.drawImage(tiles.get("current"), control.selected * 40, 2, 48, 48);
        for(var x = 8  ; x < 182 * client.config.scale ; x += 40 ){
            ctxSelector.drawImage(tiles.get("dirt"), x + 8, 10 + 8, 16, 16);
            draw.text(ctxSelector, '64', 'left', 8, x, 22);
        }
    },

    /* Optional debug grid */
    grid : function(){
        ctxEffects.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        ctxEffects.beginPath();
        for(var row = 0 ; row <= client.config.cvsWidth ; row += client.config.tileSize) {
            ctxEffects.moveTo(row, 0);
            ctxEffects.lineTo(row, client.config.cvsHeight);
        }
        for(var col = 0 ; col <= client.config.cvsHeight ; col += client.config.tileSize) {
            ctxEffects.moveTo(0, col);
            ctxEffects.lineTo(client.config.cvsWidth, col);
        }
        ctxEffects.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctxEffects.closePath();
        ctxEffects.stroke();
    },

};
