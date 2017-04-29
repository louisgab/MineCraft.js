var tiles = {
    images  : {},
    sources : {},

    /* Create DOM elements once */
    preload : function(callback){
        var src, nbLoaded = 0, nbSrc = 0;
        for(src in this.sources) nbSrc++;
        for (src in this.sources){
            this.images[src]        = new Image();
            this.images[src].src    = this.sources[src];
            this.images[src].onload = function(){
                if(++nbLoaded == nbSrc) callback();
            };
        }
    },

    /* Access to DOM elements */
    get : function(key){
        return (key in this.images) ? this.images[key] : null;
    }
};
