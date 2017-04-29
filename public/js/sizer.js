var sizer = {
    width  : 0,
    height : 0,

    /* Detect window dimension and find nearest possible values */
    detectDimensions : function(){
        this.width  = util.findMultiple(window.innerWidth);
        this.height = util.findMultiple(window.innerHeight);
        gameScreen.children[0].children[0].style.maxWidth = this.width + 'px';
        gameScreen.children[0].children[0].style.height   = this.height + 'px';
    },

    /* Make sure every canvas is good sized */
    setDimensions : function(canvas){
        canvas.width  = this.width;
        canvas.height = this.height;
        canvas.style.width  = this.width + 'px';
        canvas.style.height = this.height + 'px';
    },

    /* Pixelated images polyfill */
    disableSmoothing : function(context){
        context.msImageSmoothingEnabled     = false;
        context.mozImageSmoothingEnabled    = false;
        context.webkitImageSmoothingEnabled = false;
        context.imageSmoothingEnabled       = false;
    },

    /* Special case for selector size */
    initSelector : function(){
        var selectorWidth = (182 + 2) * client.config.scale,
            selectorHeight = 24 * client.config.scale;
        cvsSelector.width  = selectorWidth;
        cvsSelector.height = selectorHeight;
        cvsSelector.style.width  = selectorWidth + 'px';
        cvsSelector.style.height = selectorHeight + 'px';
        this.disableSmoothing(ctxSelector);
    },

    /* Apply dimensions to all canvas */
    sizeAll : function(){
        this.setDimensions(cvsMap);
        this.setDimensions(cvsPlayers);
        this.setDimensions(cvsEffects);
    },

    /* Apply fix to all canvas */
    pixelateAll : function(){
        this.disableSmoothing(ctxMap);
        this.disableSmoothing(ctxPlayers);
        this.disableSmoothing(ctxEffects);
    },

    /* Resize when needed */
    update : function(){
        sizer.detectDimensions();
        sizer.sizeAll();
        sizer.pixelateAll();
    },

    /* First detection */
    init : function(){
        this.detectDimensions();
        this.sizeAll();
        this.pixelateAll();
        this.initSelector();
    }
};
