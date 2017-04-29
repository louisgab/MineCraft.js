var network = {
    /* Approved by server */
    welcome : function(data){
        client.id      = data.id;
        client.players = data.players;
        client.map     = data.map;
        client.config  = data.config;
        tiles.sources  = data.sources;
        client.init();
    },

    /* Notify deconnexion */
    disconnect : function() {
        messageText.innerHTML       = 'Connection lost';
        messageScreen.style.display = 'table';
        gameScreen.style.display    = 'none';
    },

    /* Update players */
    players : function(players){
        client.players = players;
        anim.run();
    },

    /* Update map */
    map : function(map){
        client.map = map;
        anim.run();
    },

    /* Start networking */
    init : function(){
        socket.on('welcome',    this.welcome);
        socket.on('map',        this.map);
        socket.on('players',    this.players);
        socket.on('disconnect', this.disconnect);
    }
};
