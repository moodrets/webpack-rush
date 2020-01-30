function requireAll(r) {
    r.keys().forEach(r);
}

requireAll(require.context('../icons/', true, /\.svg$/));

const insertSvgSprite = (mode='dev') => {

    const insert = (data) => {
        document.body.insertAdjacentHTML('beforeend', data)
    }

    if ( localStorage && localStorage.getItem('svg_sprite') && mode == 'prod' ) {

        const sprite = localStorage.getItem('svg_sprite');
        insert(sprite);

    } else {

        fetch('/svg/sprite.svg', {
            method: 'get'
        })
        .then(response=>response.text())
        .then(response=>{
            localStorage.setItem( 'svg_sprite',  response );
            insert(response);
        })
    }
}

insertSvgSprite('dev');