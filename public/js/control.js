var control = {
    selected : 0,
    mouse : {
        row : 0,
        col : 0,
    },
    keyboard : {
        up   : false,
        down : false,
        left : false,
        right: false
    },
    click : {
        left  : false,
        right : false,
        isValid  : false,
        time  : null
    },

    /* When a key is pressed */
    keyDown : function(e){
        var key = e.which || e.keyCode;
        switch(key) {
            case 38:
                control.keyboard.up   = true;
                socket.emit('move', control.keyboard);
                break;
            case 40:
                control.keyboard.down  = true;
                socket.emit('move', control.keyboard);
                break;
            case 37:
                control.keyboard.left  = true;
                socket.emit('move', control.keyboard);
                break;
            case 39:
                control.keyboard.right = true;
                socket.emit('move', control.keyboard);
                break;
        }
    },

    /* When a key is released */
    keyUp : function(e){
        var key = e.which || e.keyCode;
        switch(key) {
            case 38: control.keyboard.up    = false; break;
            case 40: control.keyboard.down  = false; break;
            case 37: control.keyboard.left  = false; break;
            case 39: control.keyboard.right = false; break;
        }
    },

    /* When the mouse is moved */
    mouseMove : function(e){
        var player    = util.currentClient(),
            playerCol = util.posToTile(camera.screenX + camera.x),
            playerRow = util.posToTile(camera.screenY + camera.y),
            rectBound = cvsEffects.getBoundingClientRect();
        control.mouse.col = util.posToTile(e.clientX - rectBound.left + camera.x);
        control.mouse.row = util.posToTile(e.clientY - rectBound.top + camera.y);
        /* Player can only interact with 2 tiles around */
        var isValidCol = (playerCol - 3 < control.mouse.col && control.mouse.col < playerCol + 3),
            isValidRow = (playerRow - 4 < control.mouse.row && control.mouse.row < playerRow + 3);
        control.click.isValid = isValidCol && isValidRow;
        draw.cursor();
    },

    /* When the mouse clicks somewhere */
    mouseDown : function(e){
        if(!control.click.isValid) return;
        switch (e.which) {
            case 1:
                control.click.left = true;
                socket.emit('build', control.mouse);
                break;
            case 3:
                clearTimeout(control.click.time);
                control.click.right = true;
                control.click.time = setTimeout(function() {
                    socket.emit('destroy', control.mouse);
                }, 1000); //1sec
                draw.tile(ctxEffects, "break", util.tileToPos(control.mouse.col) - camera.x, util.tileToPos(control.mouse.row) - camera.y, 1, 1);
                break;
        }
    },

    /* When the mouse release the click */
    mouseUp : function(e){
        if(!control.click.isValid) return;
        switch (e.which) {
            case 1:
                control.click.left   = false;
                break;
            case 3:
                clearTimeout(control.click.time);
                control.click.right  = false;
                draw.map();
                break;
        }
    },

    /* When the mousewheel is rolled */
    mousewheel : function(e){
        var direction = (e.wheelDelta > 0) ? 1 : 2;
        switch(direction){
            case 1: control.selected = (control.selected < 8) ? ++control.selected : 0; break;
            case 2: control.selected = (control.selected > 0) ? --control.selected : 8; break;
        }
        draw.selector();
    },

    /* Responsive canvas */
    resize : function(){
        sizer.update();
        anim.render();
    },

    /* Start listening */
    init : function(){
        /* Track the keyboard */
        document.addEventListener('keydown', control.keyDown, false);
        document.addEventListener('keyup',   control.keyUp,   false);

        /* Track the mouse */
        cvsEffects.addEventListener('mousemove', control.mouseMove,  false);
        cvsEffects.addEventListener('mousedown', control.mouseDown,  false);
        cvsEffects.addEventListener('mouseup',   control.mouseUp,    false);
        cvsEffects.addEventListener('wheel',     control.mousewheel, false);
        cvsSelector.addEventListener('wheel',    control.mousewheel, false);

        /* Track window size */
        window.addEventListener('resize', control.resize, false);

        /* Prevent display of right click menu */
        cvsEffects.addEventListener('contextmenu', function(e){ e.preventDefault(); }, false);

        /* Animate only when current tab is focused */
        window.addEventListener('focus', anim.run,  false);
        window.addEventListener('blur',  anim.stop, false);
    }
};
