var socket     = io.connect('http://localhost:8080'),
    cvsMap     = document.getElementById('map'),
    cvsPlayers = document.getElementById('players'),
    cvsEffects = document.getElementById('effects'),
    cvsBag     = document.getElementById('bag'),
    ctxMap     = cvsMap.getContext('2d'),
    ctxPlayers = cvsPlayers.getContext('2d'),
    ctxEffects = cvsEffects.getContext('2d'),
    ctxBag     = cvsBag.getContext('2d');

var preloader = {
    sources : {
        "steve": "/img/steve.png",
        "alex" : "/img/alex.png",
        "dirt" : "/img/dirt.png",
        "stone": "/img/stone.png",
        "empty": "/img/empty.png",
        "sun"  : "/img/sun.png"
        // "coal_ore" : "/img/coal_ore.png",
        // "gold_ore" : "/img/gold_ore.png",
        // "grass" : "/img/grass_side.png",
    },
    tiles : {},
    init : function(callback) {
        var nbImg = 0, nbReady = 0;
        for(var src in this.sources)
            nbImg++;
        for (var src in this.sources){
            this.tiles[src]     = new Image();
            this.tiles[src].src = this.sources[src];
            this.tiles[src].onload = function(){
                if(++nbReady == nbImg) callback();
            };
        }
    }
};

var canvas = {
    width    : 1024,
    height   : 640,
    nbCols   : 16,
    nbRows   : 10,
    tileSize : 64,
    scale    : 4,
    setDimensions : function(cvs){
        cvs.width  = this.width;
        cvs.height = this.height;
        cvs.style.width  = this.width + 'px';
        cvs.style.height = this.height + 'px';
    },
    disableSmoothing : function(ctx){
        ctx.msImageSmoothingEnabled     = false;
        ctx.mozImageSmoothingEnabled    = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled       = false;
    },
    init : function(){
        this.setDimensions(cvsMap);
        this.setDimensions(cvsPlayers);
        this.setDimensions(cvsEffects);
        cvsBag.width  = 648;
        cvsBag.height = 72;
        cvsBag.style.width  = '648px';
        cvsBag.style.height = '72px';
        this.disableSmoothing(ctxMap);
        this.disableSmoothing(ctxPlayers);
        this.disableSmoothing(ctxEffects);
        this.disableSmoothing(ctxBag);
    }
};

var controller = {
    canClick : false,
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
        middle : false,
        right  : false
    },
    posToTile: function (pos) {
        return Math.floor(pos / canvas.tileSize);
    },
    tileToPos: function (tile) {
        return tile * canvas.tileSize;
    },
    keyDown : function(e){
        switch(e.keyCode) {
            case 38: this.movement.top   = true; break;
            case 40: this.movement.down  = true; break;
            case 37: this.movement.left  = true; break;
            case 39: this.movement.right = true; break;
        }
        socket.emit('move', this.movement);
    },
    keyUp : function(e){
        switch(e.keyCode) {
            case 38: this.movement.top   = false; break;
            case 40: this.movement.down  = false; break;
            case 37: this.movement.left  = false; break;
            case 39: this.movement.right = false; break;
        }
    },
    mouseMove : function(e){
        var player = client.players[client.id],
            rect   = cvsEffects.getBoundingClientRect();
        this.mouse.col  = this.posToTile(e.clientX - rect.left);
        this.mouse.row  = this.posToTile(e.clientY - rect.top);
        var isValidCol = (player.col -3 < this.mouse.col && this.mouse.col < player.col + 3),
            isValidRow = (player.row -4 < this.mouse.row && this.mouse.row < player.row + 3);
        this.canClick = isValidCol && isValidRow;
        client.drawCursor();
    },
    mouseDown : function(e){
        if(!this.canClick) return;
        switch (e.which) {
           case 1: this.action.left   = true; break;
           case 2: this.action.middle = true; break;
           case 3: this.action.right  = true; break;
        }
        socket.emit('build', {action:this.action, mouse:this.mouse});
    },
    mouseUp : function(e){
        switch (e.which) {
           case 1: this.action.left   = false; break;
           case 2: this.action.middle = false; break;
           case 3: this.action.right  = false; break;
        }
    }
};

var client = {
    map     : [],
    players : {},
    id      : "",
    pseudo  : "",
    initClient : function(){
        while(this.pseudo == ""){
            this.pseudo = prompt('Quel est votre pseudo ?');
        }
        canvas.init();
        preloader.init(function(){
            socket.emit('join', client.pseudo);
        });
        this.drawBag();
        // requestAnimationFrame(this.animate);
    },
    drawMap : function(){
        ctxMap.clearRect(0, 0, canvas.width, canvas.height);
        for(var row = 0 ; row < canvas.nbRows ; row++) {
            for(var col = 0 ; col <  canvas.nbCols ; col++) {
                var block = this.map[row][col],
                    x     = controller.tileToPos(col),
                    y     = controller.tileToPos(row);
                if(block == "sky"){
                    ctxMap.fillStyle = "#8cbeff";
                    ctxMap.fillRect(x, y, canvas.tileSize, canvas.tileSize);
                }
                else{
                    ctxMap.drawImage(preloader.tiles[block], x, y, canvas.tileSize, canvas.tileSize);
                }
            }
        }
        var x = controller.tileToPos(canvas.nbCols - 2),
            y = controller.tileToPos(1);
        ctxMap.drawImage(preloader.tiles["sun"], x, y, canvas.tileSize, canvas.tileSize);

    },

    drawPlayers : function(){
        ctxPlayers.clearRect(0, 0, canvas.width, canvas.height);
        var currentPlayer = client.players[client.id];
        for (var id in this.players) {
            var player = this.players[id],
                x      = controller.tileToPos(player.col),
                y      = controller.tileToPos(player.row - 1);
                skin   = (player.id == currentPlayer.id) ? "steve" : "alex";
            ctxPlayers.drawImage(preloader.tiles[skin], x, y, canvas.tileSize, 2 * canvas.tileSize);
            ctxPlayers.font      = '16px "Minecraftia"';
            ctxPlayers.textAlign = 'center';
            ctxPlayers.fillStyle = 'rgba(0,0,0,0.8)';
            ctxPlayers.fillText(player.name, x + (canvas.tileSize / 2) + 2, y + 2);
            ctxPlayers.fillStyle = 'white';
            ctxPlayers.fillText(player.name, x + (canvas.tileSize / 2), y);
        }
    },

    drawCursor : function(){
        ctxEffects.clearRect(0, 0, canvas.width, canvas.height);
        var color = (controller.canClick) ? "rgba(65, 224, 53, 0.5)" : "rgba(224, 53, 53, 0.5)",
            x = controller.tileToPos(controller.mouse.col),
            y = controller.tileToPos(controller.mouse.row);
        ctxEffects.lineWidth   = 4;
        ctxEffects.strokeStyle = color;
        ctxEffects.strokeRect(x, y, canvas.tileSize, canvas.tileSize);
    },

    drawGrid : function(){
        ctxEffects.clearRect(0, 0, canvas.width, canvas.height);
        for(var row = 0 ; row <= canvas.width ; row += canvas.tileSize) {
            ctxEffects.moveTo(row, 0);
            ctxEffects.lineTo(row, canvas.height);
        }
        for(var col = 0 ; col <= canvas.height ; col += canvas.tileSize) {
            ctxEffects.moveTo(0, col);
            ctxEffects.lineTo(canvas.width, col);
        }
        ctxEffects.strokeStyle = "#333";
        ctxEffects.stroke();
    },

    drawDisconnect : function(){
        ctxPlayers.clearRect(0, 0, canvas.width, canvas.height);
        ctxEffects.clearRect(0, 0, canvas.width, canvas.height);
        for(var row = 0 ; row < canvas.nbRows ; row++) {
            for(var col = 0 ; col <  canvas.nbCols ; col++) {
                var x = controller.tileToPos(col),
                    y = controller.tileToPos(row);
                ctxMap.drawImage(preloader.tiles["empty"], x, y, canvas.tileSize, canvas.tileSize);
            }
        }
        var x    = controller.tileToPos(canvas.nbCols / 2),
            y    = controller.tileToPos(canvas.nbRows / 2),
            text = 'Connection lost';
        ctxMap.font      = '18px Minecraftia';
        ctxMap.textAlign = 'center';
        ctxMap.fillStyle = 'rgba(0,0,0,0.8)';
        ctxMap.fillText(text, x + 2, y);
        ctxMap.fillStyle = 'white';
        ctxMap.fillText(text, x, y);
    },

    animate : function () {
        this.drawPlayers();
        requestAnimationFrame(this.animate);
    },
    drawBag : function(){
      ctxBag.clearRect(0, 0, 648, 72);
      ctxBag.fillStyle = 'rgba(0,0,0,0.8)';
      ctxBag.fillRect (0, 0, 648, 72);
      for(var x = 0  ; x <= 648 ; x += 72 )
        ctxBag.drawImage(preloader.tiles["dirt"], x + 4, 4, canvas.tileSize, canvas.tileSize);
    }
};

/* Ask pseudo and init */
window.onload = client.initClient();

// Track keyboard
document.addEventListener("keydown", function(e){
    controller.keyDown(e);
});
document.addEventListener("keyup", function(e){
    controller.keyUp(e);
});

// Track mouse
cvsEffects.addEventListener('mousemove', function(e) {
    controller.mouseMove(e);
});
cvsEffects.addEventListener('mousedown', function(e) {
    controller.mouseDown(e);
});
cvsEffects.addEventListener('mouseup', function(e) {
    controller.mouseUp(e);
});
cvsEffects.addEventListener( "contextmenu", function(e) {
    e.preventDefault();
});
// canvas.addEventListener('click', function(e) {
//     client.mouseLeftClick(e);
// }, false);
// canvas.addEventListener('mousewheel', function(e) {
//     console.log(e.wheelDelta);
//     var width = 0, height = 0;
//     if (e.wheelDelta > 0) {
//         width += 20;
//         height += 20;
//     } else if (e.wheelDelta < 0) {
//         if (width > 20) {
//             width -= 20;
//             height -= 20;
//         }
//     }
//     box.style.width = width + "px";
//     box.style.height = height + "px";
// }, false);
// canvas.addEventListener('box', function(e) {
//     e.preventDefault(); //box or contextmenu or oncontextmenu
//     alert("lol");
//     // client.mouseRightClick(e);
// }, false);
// canvas.addEventListener('contextmenu', function(e) {
//     e.preventDefault(); //box or contextmenu or oncontextmenu
//     alert("lal");
//     // client.mouseRightClick(e);
// }, false);

/* Who am I ? */
socket.on('id', function(id){
    client.id = id;
});
/* Update canvas */
socket.on('map', function(map){
    client.map = JSON.parse(map);
    client.drawMap();
});
socket.on('players', function(players){
    client.players = JSON.parse(players);
    client.drawPlayers();
});
socket.on( 'disconnect', function () {
    client.drawDisconnect();
});
