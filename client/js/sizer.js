var sizer = {

    width  : 0,
    height :0,

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
        var width = (182 + 2) * client.config.scale,
            height = 24 * client.config.scale;
        cvsSelector.width  = width;
        cvsSelector.height = height;
        cvsSelector.style.width  = width + 'px';
        cvsSelector.style.height = height + 'px';
        this.disableSmoothing(ctxSelector);
    },

    /* Detect window dimension and find nearest possible values */
    detectDimensions : function(){
        this.width  = util.findMultiple(window.innerWidth);
        this.height = util.findMultiple(window.innerHeight);
        gameScreen.children[0].children[0].style.maxWidth = this.width + 'px';
        gameScreen.children[0].children[0].style.height   = this.height + 'px';
        client.config.cvsWidth  = this.width;
        client.config.cvsHeight = this.height;
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
