$(window).load(function () {
    game.init();
});

var game = {

    // Comienzo inicializando los objetos, precargando los assets y mostrando la pantalla de inicio
    init: function () {
        //Inicializa objetos
        levels.init();
        loader.init();
        //mouse.init();

        //Oculta todas la capas del juego y muestra la pantalla de inicio
        $('.gamelayer').hide();
        $('#gamestartscreen').show();

        //Obtener el controlador para el canvas y el contexto del juego
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
    },

    showLevelScreen: function () {
        $('.gamelayer').hide(); // Oculta todas las capas del juego
        $('#levelselectscreen').show('slow'); // Muestra la de level
    },

}

//Objeto levels

var levels = {
    //Nivel de datos. Tiene un array con info acerca de cada nivel
    data: [
        { // Primer nivel
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities: []
        },
        { // Segundo nivel
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities: []
        }
    ],

    // Inicializa la pantalla de seleccion de nivel
    init: function () {
        var html = "";
        for (var i = 0; i < levels.data.length; i++) {
            var level = levels.data[i];
            html += ' <input type="button"  value="' + (i + 1) + '">';
        };
        $('#levelselectscreen').html(html);
        //Poner el botton para cargar el nivel
        $('#levelselectscreen input').click(function () {
            levels.load(this.value - 1);
            $('#levelselectscreen').hide();
        });
    },

    //Carga todos los datos e imagenes para un nivel especifico
    load: function (number) {
        //Declarar un nuevo objeto de nivel actual
        game.currentLevel = {number:number, hero:[]};
        game.score = 0;
        $('#score').html('Score: ' +game.score);
        var level = levels.data[number];

        //Cargar el fondo, el primer plano y las imagenes de la honda
        game.currentLevel.backgroundImage = loader.loadImage("../images/backgrounds/" + level.background + ".png");
        game.currentLevel.foregroundImage = loader.loadImage("../images/backgrounds/" + level.foreground + ".png");
        game.slingshotImage = loader.loadImage("../images/slingshot.png");
        game.slingshotFrontImage = loader.loadImage("../images/slingshot-front.png");

        //Llamar a game.start() cuando los assets se hayan cargado
        if (loader.loaded) {
            game.start()
        } else {
            loader.onload = game.start;
        }
    },
}

var loader = {
    loaded: true,
    loadedCount: 0, //Assets que han sido cargados antes
    totalCount: 0, //Numero total de assets que es necesario cargar

    init: function () {
        //Comprueba el soporte para sonido
        var mp3Support, oggSupport;
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
            //Actualmente canPlayType() devuelve: "","maybe","probaly"
            mp3Support = "" != audio.canPlayType('audio/mpeg');
            oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
        } else {
            //La etiqueta de audio no es soportada
            mp3Support = false;
            oggSupport = false;
        }
        //Comprueba para ogg o mp3 y si no finalmente fija soundFileExtn como undefined
        // Comprobar para ogg y mp3 si fija soundFileExt como undefined
        loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
    },

    loadImage: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    soundFileExtn: ".ogg",
    loadSound: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var audio = new Audio();
        audio.src = url + loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.loadImage, false);
        return audio;
    },
    itemLoaded: function () {
        loader.loadedCount++;
        $("#loadingmessage").html('Loaded' + loader.loadedCount + ' of ' + loader.totalCount);
        if (loader.loadedCount === loader.totalCount) {
            //El loader ha cargado completamente...
            loader.loaded = true;
            // Oculta la pantalla de carga
            $('#loadingscreen').hide();
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
}
