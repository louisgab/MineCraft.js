/* Dependencies */
var express  = require('express'),
    http     = require('http'),
    socketio = require('socket.io'),
    fs       = require('fs'),
    world    = require('./world'),
    game     = require('./game');

/* Initialisation */
var app     = express();
    server  = http.createServer(app),
    io      = socketio.listen(server);

/* Serve static files (css, img...) */
app.use(express.static('client'));

/* Load main page */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

/* Start listening for clients */
server.listen(8080, function() {
    console.log('Server ready. Listening...');
});

/* Messages processing */
io.sockets.on('connection', function(client) {

    /* Player joins */
    client.on('join', function(name) {
        game.addPlayer(client.id, name);
        console.log(name + ' joined the game.');
    });

    /* Player moves */
    client.on('move', function(movement) {
        game.updatePlayer(client.id, movement);
    });

    /* Player disconnects */
    client.on("disconnect", function() {
        var name = game.getPlayerPseudo(client.id);
        game.removePlayer(client.id);
        console.log(name + ' left the game.');
    });
});

/* 60 FPS Loop */
setInterval(function() {
    io.sockets.emit('state', game.getState());
}, 1000 / 60);
