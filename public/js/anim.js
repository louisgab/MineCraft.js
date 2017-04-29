var anim = {
    fps       : 0,
    last      : 0,
    isRunning : false,

    /* Draw everything */
    render : function(){
        camera.update();
        draw.map();
        draw.players();
        // draw.grid();
        anim.stop();
    },

    /* Animation frame with stop and go */
    loop : function () {
        if(!anim.isRunning) return;
        /* FPS calcul */
        var now   = Date.now(),
            delta = now - anim.last,
            dt    = delta / 1000.0;
        // draw.update(dt);
        anim.render();
        anim.fps  = 1 / dt;
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
};
