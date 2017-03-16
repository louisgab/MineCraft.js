/* Modules and init */
var express = require('express'),
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

/* Serve static files (css, img...) */
app.use(express.static('public'));

/* Load main page */
app.get('/', function (req, res){
    res.sendFile(__dirname+'/index.html');
})

/* Variables */
var  players = [];

/* Player object */
function Player(id){
    this.id = id;
    this.x = 0;
    this.y = 0;
}

io.sockets.on('connection', function(client) {
    console.log('New connexion : '+client.id);

    /* Player join */
    client.on('join', function(name) {
        console.log(name + 'joined the game');
        var newPlayer = Player(players.length);
        players.push(newPlayer);
        client.emit('online_users', players);
        client.broadcast.emit('online_users', players);
        console.log('Nombre de connectés : ' + players.length);
    });
/*
    client.on('new_message', function(message) {
        client.broadcast.emit('new_message', {
            pseudo: client.pseudo,
            message: message
        });
    });

    client.on("disconnect", function() {
    console.log('Deconnexion : ' + client.id);
        var index = players.indexOf(client.pseudo);
        if (index != -1) players.splice(index, 1);
        client.broadcast.emit('online_users', players);
        console.log('Nombre de connectés : ' + players.length);
    });
*/
});

/* Start listening for clients */
server.listen(8080);
console.log('Server ready. Listening...')
