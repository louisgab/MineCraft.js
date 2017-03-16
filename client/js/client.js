// Fill canvas
// function drawWorld(){
//     for (var i = 0; i < map.length; i++) {
//         for (var j = 0; j < map[i].length; j++) {
//             drawTile = map[i][j];
//             ctx.drawImage(tileGraphics[drawTile], (i - j) * tileH + mapX, (i + j) * tileH / 2 + mapY);
//             if (playerX === i && playerY === j) {
//                 ctx.drawImage(tileGraphics[2], (i - j) * tileH + mapX, (i + j) * tileH / 2 + mapY - tileH);
//             }
//         }
//     }
// }


var movement = {
    up   : false,
    down : false,
    left : false,
    right: false
}

// Main
var socket  = io.connect('http://localhost:8080'),
    canvas  = document.getElementById('canvas'),
    context = canvas.getContext('2d');

/* Ask pseudo and init */
window.onload = function() {
    var pseudo  = prompt('Quel est votre pseudo ?');
    socket.emit('join', pseudo);
    canvas.width = 1024;
    canvas.height = 800;
    context.clearRect(0, 0, 1024, 800);
}

// Track keyboard
document.addEventListener("keydown", function(e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
        case 38:
            movement.top = true;
        break;
        case 40:
            movement.down = true;
        break;
        case 37:
            movement.left = true;
        break;
        case 39:
            movement.right = true;
        break;
    }
});
document.addEventListener("keyup", function(e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
        case 38:
            movement.top = false;
        break;
        case 40:
            movement.down = false;
        break;
        case 37:
            movement.left = false;
        break;
        case 39:
            movement.right = false;
        break;
    }
});

/* 60FPS loop */
setInterval(function() {
    socket.emit('move', movement);
}, 1000 / 60);

/* Update canvas */
socket.on('state', function(players) {
    context.clearRect(0, 0, 1024, 800);
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fill();
    }
});
