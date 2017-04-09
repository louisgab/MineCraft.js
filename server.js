/* Dependencies */
var express  = require('express'),
    http     = require('http'),
    socketio = require('socket.io'),
    fs       = require('fs'),
    config   = require('./config.json'),
    sources  = require('./sources.json'),
    game     = require('./game');

/* Initialisation */
var app     = express();
    server  = http.Server(app),
    io      = socketio(server);

/* Serve static files (css, img...) */
app.use(express.static(__dirname + '/client'));

/* Load main page */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

/* Start listening for clients */
server.listen(8080, function() {
    console.log('Server ready. Listening...');
});

/* Network processing */
io.sockets.on('connection', function(client) {

    /* Player joins */
    client.on('join', function(name) {
        if(!game.isGenerated) game.generate(config);
        game.addPlayer(client.id, name);
        client.emit('welcome', {
            id     : client.id,
            players: game.players,
            map    : game.map,
            config : config,
            sources: sources
        });
        /* Warn others */
        client.broadcast.emit('players', game.players);
        console.log(name + ' joined the game.');
    });

    /* Player moves */
    client.on('move', function(keyboard) {
        game.updatePlayer(client.id, keyboard);
        io.sockets.emit('players', game.players);
    });

    /* Player builds */
    client.on('build', function(mouse) {
        game.addBlock(mouse.row, mouse.col, "dirt");
        io.sockets.emit('map', game.map);
    });

    /* Player destroys */
    client.on('destroy', function(mouse) {
        game.removeBlock(mouse.row, mouse.col);
        io.sockets.emit('map', game.map);
    });

    /* Player disconnects */
    client.on("disconnect", function() {
        var name = game.getPlayerPseudo(client.id);
        game.removePlayer(client.id);
        io.sockets.emit('players', game.players);
        console.log(name + ' left the game.');
    });
});
