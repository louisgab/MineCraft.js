var http = require('http'),
    fs = require('fs'),
    server = http.createServer(),
    io = require('socket.io').listen(server),
    userlist = [];

server.on('request', function(req, res) {
    switch (req.url) {
        case "/index.html":
            fs.readFile('./index.html', 'utf-8', function(err, content) {
                if (err) console.log(err);
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(content);
            });
            break;
        case "/css/sanitize.css":
            fs.readFile('./css/sanitize.css', 'utf-8', function(err, content) {
                if (err) console.log(err);
                res.writeHead(200, {
                    'Content-Type': 'text/css'
                });
                res.end(content);
            });
            break;
        case "/css/main.css":
            fs.readFile('./css/main.css', function(err, content) {
                if (err) console.log(err);
                res.writeHead(200, {
                    'Content-Type': 'text/css'
                });
                res.end(content);
            });
            break;
        default:
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
            res.end("Erreur 404");
            break;
    }
});

io.sockets.on('connection', function(socket, pseudo) {
    socket.on('new_user', function(pseudo) {
        userlist.push(pseudo);
        socket.pseudo = pseudo;
        socket.emit('online_users', userlist);
        socket.broadcast.emit('online_users', userlist);
        console.log('Nombre de connectés : ' + userlist.length);
    });

    socket.on('new_message', function(message) {
        socket.broadcast.emit('new_message', {
            pseudo: socket.pseudo,
            message: message
        });
    });

    socket.on("disconnect", function() {
        var index = userlist.indexOf(socket.pseudo);
        if (index != -1) userlist.splice(index, 1);
        socket.broadcast.emit('online_users', userlist);
        console.log('Nombre de connectés : ' + userlist.length);
    });
});
server.listen(8080);
