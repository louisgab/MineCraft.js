var draw = {
    /* Easy tile draw */
    tile : function(context, block, x, y){
        if(block == "sky"){
            context.fillStyle = "#8cbeff";
            context.fillRect(x, y, client.config.tileSize, client.config.tileSize);
        }
        else{
            context.drawImage(tiles.get(block), x, y, client.config.tileSize, client.config.tileSize);
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
        for(var row = 0 ; row < client.config.cvsRows ; row++) {
            for(var col = 0 ; col < client.config.cvsCols ; col++) {
                var block = client.map[row][col],
                    x     = util.tileToPos(col),
                    y     = util.tileToPos(row);
                draw.tile(ctxMap, block, x, y);
            }
        }
        /* Add sun on top right corner */
        var x = util.tileToPos(client.config.cvsCols - 2),
            y = util.tileToPos(1);
        draw.tile(ctxMap, "sun", x, y);
    },

    /* Clear then display all players */
    players : function(){
        ctxPlayers.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        var currentPlayer = util.currentClient();
        for (var id in client.players) {
            var player = client.players[id],
                height = 2 * client.config.tileSize,
                skin = (player.id == currentPlayer.id) ? "steve" : "alex";
            ctxPlayers.drawImage(tiles.get(skin), player.x, player.y - client.config.tileSize, client.config.tileSize, height);
            draw.text(ctxPlayers, player.name, 'center', '16', player.x + (client.config.tileSize / 2), player.y - height);
        }
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

    /* Clear then display cursor selected tile */
    cursor : function(){
        ctxEffects.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        var x = util.tileToPos(control.mouse.col),
            y = util.tileToPos(control.mouse.row);
        ctxEffects.lineWidth   = 4;
        ctxEffects.strokeStyle = (control.click.isValid) ? "rgba(65, 224, 53, 0.5)" : "rgba(224, 53, 53, 0.5)";
        ctxEffects.strokeRect(x, y, client.config.tileSize, client.config.tileSize);
    },

    /* Optional debug grid */
    grid : function(){
        ctxEffects.clearRect(0, 0, client.config.cvsWidth, client.config.cvsHeight);
        for(var row = 0 ; row <= client.config.cvsWidth ; row += client.config.tileSize) {
            ctxEffects.moveTo(row, 0);
            ctxEffects.lineTo(row, client.config.cvsHeight);
        }
        for(var col = 0 ; col <= client.config.cvsHeight ; col += client.config.tileSize) {
            ctxEffects.moveTo(0, col);
            ctxEffects.lineTo(client.config.cvsWidth, col);
        }
        ctxEffects.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctxEffects.stroke();
    },

};
