var socket  = io.connect('http://localhost:8080'),
    canvas  = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var preloader = {
    objects : {},
    url : {
        "dirt" : "/img/dirt.png"
    }
    init : function(){
        for (var item in this.url) {
            var img = new Image();
            img.src = this.url[item];
            img.onload = function(){
                this.objects[item] = img;
            }
        }
    }
}

var client = {
    pseudo : "",
    game : {},
    movement : {
        up   : false,
        down : false,
        left : false,
        right: false
    },

    initClient : function(){
        while(this.pseudo == ""){
            this.pseudo = prompt('Quel est votre pseudo ?');
        }
        canvas.width = 1024;
        canvas.height = 800;
        socket.emit('join', this.pseudo);
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

    updateCanvas : function (game){
        this.game = game;
        context.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
        this.drawGrid();
        // drawMap();
        this.drawPlayers();
    },

    drawGrid : function(){
        for(var row = 0 ; row <= this.game.canvasWidth ; row += this.game.tileSize) {
            context.moveTo(row, 0);
            context.lineTo(row, this.game.canvasHeight);
        }
        for(var col = 0 ; col <= this.game.canvasHeight ; col += this.game.tileSize) {
            context.moveTo(0, col);
            context.lineTo(this.game.canvasWidth, col);
        }
        context.strokeStyle = "#333";
        context.stroke();
    },

    drawMap : function(){
        // for(var row = 0 ; row < NB_ROWS ; row++) {
    	// 	for(var col = 0 ; col < NB_COLS col++) {
        //         if(map[row][col]){
        //             this.drawBlock(context, row, col);
        //         }
    	// 	}
    	// }
        // var xSourceEnTiles = id % TILE_SIZE;
        // if(xSourceEnTiles == 0) xSourceEnTiles = TILE_SIZE;
        // var ySourceEnTiles = Math.ceil(id / TILE_SIZE);
        //
        // var xSource = (xSourceEnTiles - 1) * 32;
        // var ySource = (ySourceEnTiles - 1) * 32;
        context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);

    },

    drawPlayers : function(){
        context.fillStyle = 'green';
        for (var id in this.game.players) {
            var player = this.game.players[id],
                tileCol = player.col * this.game.tileSize,
                tileRow = player.row * this.game.tileSize;
            context.fillRect(tileCol, tileRow, this.game.tileSize, this.game.tileSize);
            context.font='12px "Press Start 2P"';
            context.fillStyle = 'white';
            context.fillText(player.name, tileCol, tileRow);
        }
    }
};

/* Ask pseudo and init */
window.onload = client.initClient();

// Track keyboard
document.addEventListener("keydown", function(e){
    client.keyDown(e);
});
document.addEventListener("keyup", function(e){
    client.keyUp(e);
});

// Track mouse
document.addEventListener("mouseover", myFunction);
document.addEventListener("mousedown", someOtherFunction);
document.addEventListener("mouseout", someOtherFunction);

/* Update canvas */
socket.on('update', function(game){
    client.updateCanvas(game);
});
