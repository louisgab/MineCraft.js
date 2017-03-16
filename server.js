/* Modules and init */
var express = require('express'),
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    world = require('./world'),
    player = require('./player');

/* Serve static files (css, img...) */
app.use(express.static('public'));

/* Load main page */
app.get('/', function (req, res){
    res.sendFile(__dirname+'/index.html');
})

io.sockets.on('connection', function(client) {
    console.log('New connexion : '+client.id);

    /* Player joins */
    client.on('join', function(name) {
        var newPlayer = player.add(name);
        client.id = newPlayer.id;
        console.log(name + 'joined the game.');
    });

    /* Player moves */
    client.on('move', function(data){
        player.updatePosition(client.id, data);
    }

    /* Player disconnects */
    client.on("disconnect", function() {
        var name = player.getName(client.id);
        console.log(name + 'disconnected.');
        player.remove(client.id);
    });
});

/* Start listening for clients */
server.listen(8080);
console.log('Server ready. Listening...')
