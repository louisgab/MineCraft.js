/* Socket, DOM Elements, variables */
var socket          = io.connect('http://localhost:8080'),
    startButton     = document.getElementById('startButton'),
    playerNameInput = document.getElementById('playerNameInput'),
    messageScreen   = document.getElementById('messageScreen'),
    messageText     = document.getElementById('messageText'),
    gameScreen      = document.getElementById('gameScreen'),
    startScreen     = document.getElementById('startScreen');
    cvsMap          = document.getElementById('map'),
    cvsPlayers      = document.getElementById('players'),
    cvsEffects      = document.getElementById('effects'),
    cvsSelector     = document.getElementById('selector'),
    ctxMap          = cvsMap.getContext('2d'),
    ctxPlayers      = cvsPlayers.getContext('2d'),
    ctxEffects      = cvsEffects.getContext('2d'),
    ctxSelector     = cvsSelector.getContext('2d'),
    screenWidth     = window.innerWidth,
    screenHeight    = window.innerHeight;

/* Main object */
var client = {
    config  : {},
    players : {},
    map     : {},
    id      : "",
    pseudo  : "",

    /* Display loading screen and wait for server answer */
    load : function(){
        client.pseudo = playerNameInput.value;
        messageText.innerHTML       = 'Loading world...';
        messageScreen.style.display = 'block';
        startScreen.style.display   = 'none';
        socket.emit('join', client.pseudo);
    },

    /* Init everything, draw everything, and ready ! */
    init : function(){
        canvas.init();
        control.init();
        tiles.preload(function(){
            draw.map();
            draw.selector();
            draw.players();
            // anim.init();
            setTimeout(function () {
                messageScreen.style.display = 'none';
                gameScreen.style.display    = 'block';
            }, 500);
        });
    }
};

/* On browser ready */
window.onload = function(){
    /* Player wrote his name */
    startButton.onclick = client.load;
    playerNameInput.onkeypress = function(e){
        var key = e.which || e.keyCode;
        if (key === 13) client.load(); // Pressed enter
    };
};

/* Approved by server */
socket.on('welcome', function(data){
    client.id      = data.id;
    client.players = data.players;
    client.map     = data.map;
    client.config  = data.config;
    tiles.sources  = data.sources;
    client.init();
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

/* Notify deconnexion */
socket.on('disconnect', function () {
    messageText.innerHTML       = 'Connection lost';
    messageScreen.style.display = 'block';
    gameScreen.style.display    = 'none';
});
