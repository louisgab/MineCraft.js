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

/* Use default config ip:port unless a preconfigured environnement exists */
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
    console.log('Server ready. Listening at ' + ip + ':' + port + '...');
});

/* Network processing */
io.sockets.on('connection', function(client) {

    // A player wants to join.
    // - generate a world if needed
    // - create the player object and send him all the data
    // - notice others
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
        client.broadcast.emit('players', game.players);
    });

    // A player wants to move.
    // - check collisions then update players
    // - notice everybody
    client.on('move', function(keyboard) {
        game.updatePlayer(client.id, keyboard);
        io.sockets.emit('players', game.players);
    });

    // A player wants to build.
    // - check autorize then update map
    // - notice everybody
    client.on('build', function(mouse) {
        game.addBlock(mouse.row, mouse.col, "dirt");
        io.sockets.emit('map', game.map);
    });

    // A player wants to destroy.
    // - check autorize and falls then update map
    // - notice everybody
    client.on('destroy', function(mouse) {
        game.removeBlock(mouse.row, mouse.col);
        if(game.isSomeoneFalling(mouse.row, mouse.col)){
            io.sockets.emit('players', game.players);
        }
        io.sockets.emit('map', game.map);
    });

    // A player has disconnected
    // - Check if is logged then update players
    // - notice others
    client.on("disconnect", function() {
        game.removePlayer(client.id);
        client.broadcast.emit('players', game.players);
    });
});
