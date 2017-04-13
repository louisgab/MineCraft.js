/* Dependencies */
var express  = require('express'),
    http     = require('http'),
    socketio = require('socket.io'),
    config   = require('./config.json'),
    sources  = require('./sources.json'),
    game     = require('./game');

/* Initialisation */
var app     = express(),
    server  = http.Server(app),
    io      = socketio(server);

/* use default config ip:port unless it exists a preconfigured environnement */
var port = process.env.PORT || config.port,
    ip   = process.env.IP   || config.ip;

/* Serve static files (css, img...) */
app.use(express.static(__dirname + '/public'));

/* Load main page */
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

/* Start listening for clients */
server.listen(port, ip, function() {
    console.log('Server ready. Listening at '+ip+':'+port+'...');
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
        if(game.checkFallEverybody(mouse.row, mouse.col)){
            io.sockets.emit('players', game.players);
        }
        io.sockets.emit('map', game.map);
    });

    /* Player disconnects */
    client.on("disconnect", function() {
        var name = game.getPlayerPseudo(client.id);
        if(name){
            game.removePlayer(client.id);
            io.sockets.emit('players', game.players);
            console.log(name + ' left the game.');
        }
    });
});
