// Preparar requestAnimationFrame y cancelAnimationFrame para su uso en el codigo del juego
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall); lastTime = currTime + timeToCall; return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

// Inicio
$(window).load(function () {
    game.init();
});

var game = {

    // Comienzo inicializando los objetos, precargando los assets y mostrando la pantalla de inicio
    init: function () {
        //Inicializa objetos
        levels.init();
        loader.init();
        mouse.init();

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

    // Modo Game
    mode: "intro",
    // Coordenadas de la honda , X e Y 
    slingshotX: 140,
    slingshotY: 280,
    start: function () {
        $('.gamelayer').hide();
        // Mostrar el canvas del juego y la puntacion 
        $('#gamecanvas').show();
        $('#scorescreen').show();

        //game.startBackgroundMusic();

        game.mode = "intro"; // Almacena el estado del juego actual
        game.offsetLeft = 0;
        game.ended = false;
        game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        // Fija el intervalo de animacion del juego 
    },

    // Velocidad maxima de fotograma
	maxSpeed:3,
	// minimo y maximo de offset
	minOffset:0,
	maxOffset:300,
	// Desplazamiento de panorámica actual
	offsetLeft:0,
	// La puntuacion del juego.
	score:0,

	//Desplegar la pantalla para centrarse en newCenter. Primero mueve hacia la derecha para mostrar el objetivo, luego deberia volver.
	panTo:function(newCenter){
		if (Math.abs(newCenter-game.offsetLeft-game.canvas.width/4)>0
			&& game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset){

			var deltaX = Math.round((newCenter-game.offsetLeft-game.canvas.width/4)/2);
			if (deltaX && Math.abs(deltaX)>game.maxSpeed){
				deltaX = game.maxSpeed*Math.abs(deltaX)/(deltaX);
			}
			game.offsetLeft += deltaX;
		} else {

			return true;
		}
		if (game.offsetLeft < game.minOffset){
			game.offsetLeft = game.minOffset;
			return true;
		} else if (game.offsetLeft > game.maxOffset){
			game.offsetLeft = game.maxOffset;
			return true;
		}
		return false;
    },
    
    handlePanning: function () {
        game.offsetLeft++; // Marca de posicion temporal, mantiene la panoramica a la derecha
        if(game.mode =="intro"){
            if(game.panTo(700)){
                game.mode = "load-next-hero";
            }
        }
        if(game.mode =="wait-for-firing"){
            if(mouse.dragging){
                game.panTo(mouse.x + game.offsetLeft)
            }else{
                game.panTo(game.slingshotX);
            }
        }

        if(game.mode=="load-next-hero"){
            //TODO
            // comprobar si algun villano esta vivo, si no, terminar el nivel exito
            // Comprobar si quedan más heroes para cargar, si no terminar el nivel
            // Cargar el heroe y fijar a modo de espera para disparar
            game.mode = "wait-for-firing";
        }

        if(game.mode == "firing"){
            game.panTo(game.slingshotX);
        }

        if(game.mode == "fired"){
            //Todo
            //Hacer una panoramica donde quiera que el heroe se encuentre actualmente
        }
    }, // Errata en las diapos 

    animate: function () {
        //Anima el fondo
        game.handlePanning();

        //Anima los personajes

        //Dibuja el fondo con un desplazamiento 
        game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft/4, 0, 640, 480, 0, 0, 640, 480);
        game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
        // Se mueven a diferentes velocidades.

        //Dibuja la honda 
        game.context.drawImage(game.slingshotImage, game.slingshotX - game.offsetLeft, game.slingshotY);
        game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.offsetLeft, game.slingshotY);

        if (!game.ended) {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        }
    }



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
        game.currentLevel = { number: number, hero: [] };
        game.score = 0;
        $('#score').html('Score: ' + game.score);
        var level = levels.data[number];

        //Cargar el fondo, el primer plano y las imagenes de la honda
        game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
        game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
        game.slingshotImage = loader.loadImage("images/slingshot.png");
        game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");

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

    // Carga las imagenes X of Y 

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

var mouse = {
	x:0,
	y:0,
    down:false,
    // Fija los elementos para cuando se mueve, o presiones.
	init:function(){
		$('#gamecanvas').mousemove(mouse.mousemovehandler);
		$('#gamecanvas').mousedown(mouse.mousedownhandler);
		$('#gamecanvas').mouseup(mouse.mouseuphandler);
		$('#gamecanvas').mouseout(mouse.mouseuphandler);
    },
    // Calcula las coordenadas X e Y del raton respecto a la esquina superior izquierda
	mousemovehandler:function(ev){
		var offset = $('#gamecanvas').offset();

		mouse.x = ev.pageX - offset.left;
		mouse.y = ev.pageY - offset.top;

		if (mouse.down) {
			mouse.dragging = true;
		}
    },
    // Almacena la ubicacion de donde está el raton.
	mousedownhandler:function(ev){
		mouse.down = true;
		mouse.downX = mouse.x;
		mouse.downY = mouse.y;
		ev.originalEvent.preventDefault();

	},
	mouseuphandler:function(ev){
		mouse.down = false;
		mouse.dragging = false;
	}
}
