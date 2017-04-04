var socket      = io.connect('http://localhost:8080'),
    cvsMap      = document.getElementById('map'),
    cvsPlayers  = document.getElementById('players'),
    cvsEffects  = document.getElementById('effects'),
    cvsSelector = document.getElementById('selector'),
    ctxMap      = cvsMap.getContext('2d'),
    ctxPlayers  = cvsPlayers.getContext('2d'),
    ctxEffects  = cvsEffects.getContext('2d'),
    ctxSelector = cvsSelector.getContext('2d');

var tiles = {
    images : {},
    sources : {},
    preload : function(callback){
        var nbLoaded = 0, nbSrc = 0;
        for(var src in this.sources) nbSrc++;
        for (var src in this.sources){
            this.images[src]        = new Image();
            this.images[src].src    = this.sources[src];
            this.images[src].onload = function(){
                if(++nbLoaded == nbSrc) callback();
            };
        }
    },
    get : function(name){
        return this.images[name];
    }
};

var canvas = {
    setDimensions : function(cvs){
        cvs.width  = client.config.width;
        cvs.height = client.config.height;
        cvs.style.width  = client.config.width + 'px';
        cvs.style.height = client.config.height + 'px';
    },
    disableSmoothing : function(ctx){
        ctx.msImageSmoothingEnabled     = false;
        ctx.mozImageSmoothingEnabled    = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled       = false;
    },
    setSelector : function(cvs){
        var width = (182 + 2) * client.config.scale,
            height = 24 * client.config.scale;
        cvs.width  = width;
        cvs.height = height;
        cvs.style.width  = width + 'px';
        cvs.style.height = height + 'px';
    },
    init : function(){
        this.setDimensions(cvsMap);
        this.setDimensions(cvsPlayers);
        this.setDimensions(cvsEffects);
        this.disableSmoothing(ctxMap);
        this.disableSmoothing(ctxPlayers);
        this.disableSmoothing(ctxEffects);
        this.setSelector(cvsSelector);
        this.disableSmoothing(ctxSelector);
    }
};

var controller = {
    clickTime : null,
    canClick  : false,
    selected : 0,
    mouse : {
        col : 0,
        row : 0
    },
    movement : {
        up   : false,
        down : false,
        left : false,
        right: false
    },
    action : {
        left   : false,
        right  : false
    },
    posToTile: function (pos) {
        return Math.floor(pos / client.config.tileSize);
    },
    tileToPos: function (tile) {
        return tile * client.config.tileSize;
    },
    keyDown : function(e){
        switch(e.keyCode) {
            case 38:
                controller.movement.top   = true;
                socket.emit('move', controller.movement);
                break;
            case 40:
                controller.movement.down  = true;
                socket.emit('move', controller.movement);
                break;
            case 37:
                controller.movement.left  = true;
                socket.emit('move', controller.movement);
                break;
            case 39:
                controller.movement.right = true;
                socket.emit('move', controller.movement);
                break;
        }
    },
    keyUp : function(e){
        switch(e.keyCode) {
            case 38: controller.movement.top   = false; break;
            case 40: controller.movement.down  = false; break;
            case 37: controller.movement.left  = false; break;
            case 39: controller.movement.right = false; break;
        }
    },
    mouseMove : function(e){
        var player = client.players[client.id],
            mouse  = controller.mouse,
            rect   = cvsEffects.getBoundingClientRect();
        mouse.col  = controller.posToTile(e.clientX - rect.left);
        mouse.row  = controller.posToTile(e.clientY - rect.top);
        var isValidCol = (player.col -3 < mouse.col && mouse.col < player.col + 3),
            isValidRow = (player.row -4 < mouse.row && mouse.row < player.row + 3);
        controller.canClick = isValidCol && isValidRow;
        draw.cursor();
    },
    mouseDown : function(e){
        if(!controller.canClick) return;
        switch (e.which) {
            case 1:
                controller.action.left = true;
                socket.emit('build', controller.mouse);
                break;
            case 3:
                clearTimeout(this.clickTime);
                controller.action.right = true;
                this.clickTime = setTimeout(function() {
                    socket.emit('destroy', controller.mouse);
                }, 1000); //1sec
                var x = controller.tileToPos(controller.mouse.col),
                    y = controller.tileToPos(controller.mouse.row);
                ctxEffects.drawImage(tiles.get("break"), x, y, client.config.tileSize, client.config.tileSize);
                break;
        }
    },
    mouseUp : function(e){
        if(!controller.canClick) return;
        switch (e.which) {
            case 1:
                controller.action.left   = false;
                break;
            case 3:
                clearTimeout(this.clickTime);
                controller.action.right  = false;
                draw.map();
            break;
        }
    },
    mousewheel : function(e){
        var direction = (e.wheelDelta > 0) ? 1 : 2;
        switch(direction){
            case 1: controller.selected = (controller.selected < 8) ? ++controller.selected : 0; break;
            case 2: controller.selected = (controller.selected > 0) ? --controller.selected : 8; break;
        }
        draw.selector();
    }
};

var draw = {
    tile : function(block, x, y){
        ctxMap.drawImage(tiles.get(block), x, y, client.config.tileSize, client.config.tileSize);
    },
    text : function(context, text, align, size, x, y){
        var tilt = (size > 10) ? 2 : 1;
        context.font      = size + 'px Minecraftia';
        context.textAlign = align;
        context.fillStyle = 'rgba(0,0,0,0.8)';
        context.fillText(text, x + tilt, y + tilt);
        context.fillStyle = 'white';
        context.fillText(text, x, y);
    },
    map : function(){
        ctxMap.clearRect(0, 0, client.config.width, client.config.height);
        for(var row = 0 ; row < client.config.nbRows ; row++) {
            for(var col = 0 ; col <  client.config.nbCols ; col++) {
                var block = client.map[row][col],
                    x     = controller.tileToPos(col),
                    y     = controller.tileToPos(row);
                if(block == "sky"){
                    ctxMap.fillStyle = "#8cbeff";
                    ctxMap.fillRect(x, y, client.config.tileSize, client.config.tileSize);
                }
                else{
            draw.tile(block, x, y);
                }
            }
        }
        var x = controller.tileToPos(client.config.nbCols - 2),
            y = controller.tileToPos(1);
            draw.tile("sun", x, y);
    },
    players : function(){
        ctxPlayers.clearRect(0, 0, client.config.width, client.config.height);
        var currentPlayer = client.players[client.id];
        for (var id in client.players) {
            var player = client.players[id],
                x      = controller.tileToPos(player.col),
                y      = controller.tileToPos(player.row - 1);
                skin   = (player.id == currentPlayer.id) ? "steve" : "alex";
            ctxPlayers.drawImage(tiles.get(skin), x, y, client.config.tileSize, 2 * client.config.tileSize);
            draw.text(ctxPlayers, player.name, 'center', '16', x + (client.config.tileSize / 2), y);
        }
    },
    cursor : function(){
        ctxEffects.clearRect(0, 0, client.config.width, client.config.height);
        var color = (controller.canClick) ? "rgba(65, 224, 53, 0.5)" : "rgba(224, 53, 53, 0.5)",
            x = controller.tileToPos(controller.mouse.col),
            y = controller.tileToPos(controller.mouse.row);
        ctxEffects.lineWidth   = 4;
        ctxEffects.strokeStyle = color;
        ctxEffects.strokeRect(x, y, client.config.tileSize, client.config.tileSize);
    },
    grid : function(){
        ctxEffects.clearRect(0, 0, client.config.width, client.config.height);
        for(var row = 0 ; row <= client.config.width ; row += client.config.tileSize) {
            ctxEffects.moveTo(row, 0);
            ctxEffects.lineTo(row, client.config.height);
        }
        for(var col = 0 ; col <= client.config.height ; col += client.config.tileSize) {
            ctxEffects.moveTo(0, col);
            ctxEffects.lineTo(client.config.width, col);
        }
        ctxEffects.strokeStyle = "#333";
        ctxEffects.stroke();
    },
    disconnect : function(){
        ctxPlayers.clearRect(0, 0, client.config.width, client.config.height);
        ctxEffects.clearRect(0, 0, client.config.width, client.config.height);
        ctxSelector.clearRect(0, 0, 368, 48);
        for(var row = 0 ; row < client.config.nbRows ; row++) {
            for(var col = 0 ; col <  client.config.nbCols ; col++) {
                var x = controller.tileToPos(col),
                    y = controller.tileToPos(row);
            draw.tile("empty", x, y);
            }
        }
        var x    = controller.tileToPos(client.config.nbCols / 2),
            y    = controller.tileToPos(client.config.nbRows / 2);
            draw.text(ctxMap, 'Connection lost', 'center', '18', x, y);
    },
    // animate : function () {
    //     this.drawPlayers();
    //     requestAnimationFrame(this.animate);
    // },
    selector : function(){
        ctxSelector.clearRect(0, 0, 368, 48);
        ctxSelector.drawImage(tiles.get("selector"), 2, 4, 364, 44);
        ctxSelector.drawImage(tiles.get("current"), controller.selected * 40, 2, 48, 48);
        for(var x = 8  ; x < 364 ; x += 40 ){
            ctxSelector.drawImage(tiles.get("dirt"), x + 8, 10 +  8, 16, 16);
            draw.text(ctxSelector, '64', 'left', 8, x, 22);
        }
    }
};

var client = {
    config  : {},
    players : {},
    map     : {},
    id      : "",
    pseudo  : "",
    init : function(){
        // while(this.pseudo == ""){
        //     this.pseudo = prompt('Quel est votre pseudo ?');
        // }
        this.pseudo = "lol";
        canvas.init();
        tiles.preload(function(){
            socket.emit('join', client.pseudo);
        });
        // requestAnimationFrame(this.animate);
    }
};

/* Browser ready */
window.onload = function(){

    /* Initial data */
    socket.on('config', function(data){
        tiles.sources = data.sources;
        client.config = data.config;
        client.init();
    });

    /* Approved by server */
    socket.on('welcome', function(data){
        client.players = data.players;
        client.map = data.map;
        client.id = data.id;
        draw.selector();
        draw.players();
        draw.map();
    });

    /* Update canvas on demand */
    socket.on('map', function(map){
        client.map = map;
        draw.map();
    });
    socket.on('players', function(players){
        client.players = players;
        draw.players();
    });

    // Prevent right click menu
    cvsEffects.addEventListener('contextmenu', function(e){
        e.preventDefault();
    }, false);

    // Track keyboard
    document.addEventListener('keydown', controller.keyDown, false);
    document.addEventListener('keyup',   controller.keyUp,   false);

    // Track mouse
    cvsEffects.addEventListener('mousemove', controller.mouseMove,  false);
    cvsEffects.addEventListener('mousedown', controller.mouseDown,  false);
    cvsEffects.addEventListener('mouseup',   controller.mouseUp,    false);
    cvsEffects.addEventListener('wheel',     controller.mousewheel, false);
    cvsSelector.addEventListener('wheel',    controller.mousewheel, false);

    /* Notify server deconnexion */
    socket.on('disconnect', function () {
        cvsEffects.removeEventListener('mousemove', controller.mouseMove,  false);
        cvsEffects.removeEventListener('mousedown', controller.mouseDown,  false);
        cvsEffects.removeEventListener('mouseup',   controller.mouseUp,    false);
        cvsEffects.removeEventListener('wheel',     controller.mousewheel, false);
        cvsSelector.removeEventListener('wheel',    controller.mousewheel, false);
        draw.disconnect();
    });
};
