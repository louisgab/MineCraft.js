var canvas = {
    /* Make sure every canvas is good sized */
    setDimensions : function(cvs){
        cvs.width  = client.config.cvsWidth;
        cvs.height = client.config.cvsHeight;
        cvs.style.width  = client.config.cvsWidth + 'px';
        cvs.style.height = client.config.cvsHeight + 'px';
    },

    /* Pixelated images polyfill */
    disableSmoothing : function(ctx){
        ctx.msImageSmoothingEnabled     = false;
        ctx.mozImageSmoothingEnabled    = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled       = false;
    },

    /* Special case for selector size */
    setSelector : function(cvs){
        var width = (182 + 2) * client.config.scale,
            height = 24 * client.config.scale;
        cvs.width  = width;
        cvs.height = height;
        cvs.style.width  = width + 'px';
        cvs.style.height = height + 'px';
    },

    /* Apply to all canvas */
    init : function(){
        this.setDimensions(cvsMap);
        this.setDimensions(cvsPlayers);
        this.setDimensions(cvsEffects);
        this.disableSmoothing(ctxMap);
        this.disableSmoothing(ctxPlayers);
        this.disableSmoothing(ctxEffects);
        this.setSelector(cvsSelector);
        this.disableSmoothing(ctxSelector);
    }
};
