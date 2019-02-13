class LayerMakerMap {
    constructor( map_root ) {

    }
}

$(function() {
    let root = document.querySelector('#layer-maker-map-root');
    if( root ) {
        new LayerMakerMap( root );
    }
});

