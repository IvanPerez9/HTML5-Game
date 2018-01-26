$(window).load(function(){
               game.init();
});

//Objeto levels

var levels = {
    //Nivel de datos. Tiene un array con info acerca de cada nivel
    data:[
        { // Primer nivel
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities:[]
        },
        { // Segundo nivel
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities:[]
        }
    ],
    
    // Inicializa la pantalla de seleccion de nivel
    init:function(){
        var html = "";
        for(var i=0; i<levels.data.length; i++){
            var level = levels.data[i];
            html += '<input type="button"  value="'+(i+1)+'">';
        };
        $('#levelselectscreen input').click(function(){
            levels.load(this.value-1);
            $('#levelselectscreen').hide();
        });
    },
    //carga todos los datos e imagenes para un nivel especifico
    load:function(Number){
    }
    
}



var game = {
    
    // Comienzo inicializando los objetos, precargando los assets y mostrando la pantalla de inicio
    init: function(){
        //Inicializa objetos
        levels.init();
        loader.init();
        mouse.init();
        
        //Oculta todas la capas del juego y muestra la pantalla de inicio
        $('.gameplayer').hide();
        $('#gamestartscreen').show();
        
        //Obtener el controlador para el canvas y el contexto del juego
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
    },

    showLevelScreen:function(){
		$('.gamelayer').hide(); // Oculta todas las capas del juego
		$('#levelselectscreen').show('slow'); // Muestra la de level
	},


    
}