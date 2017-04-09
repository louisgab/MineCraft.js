/* Not in use : will be necessary for jump and fall... */
var anim = {
    isRunning : false,
    last : 0,

    /* Draw everything */
    render : function(){
        draw.map();
        draw.players();
        draw.grid();
    },

    /* Animation frame with stop and go */
    loop : function () {
        if(!anim.isRunning) return;
        var now   = Date.now(),
            delta = now - anim.last,
            dt    = delta / 1000.0;
        // draw.update(dt);
        anim.render();
        anim.last = now;
        window.requestAnimFrame(anim.loop);
    },

    /* Temporary pause animation */
    stop : function(){
        if (!anim.isRunning) return;
        anim.isRunning = false;
    },

    /* Start animation */
    run : function(){
        if (anim.isRunning) return;
        anim.isRunning = true;
        anim.last = Date.now();
        anim.loop();
    },

    /* Start animating */
    init : function(){
        /* Animation polyfill */
        window.requestAnimFrame = (function(){
            return window.requestAnimationFrame       ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame    ||
                   function(callback){
                       window.setTimeout(callback, 1000 / 60);
                   };
        })();
        anim.run();
    }
}
