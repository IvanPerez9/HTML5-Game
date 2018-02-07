// Objetos
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body; // Corazón, contiene los metodos de inicio
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var world;
var scale = 30; // 30 pixeles en el canvas equivalen a 1 metro
function init(){
    // Configuracion del mundo Box2d que realizará la mayor parte del cálculo
    var gravity = new b2Vec2(0,9.8); // Declara la gravedar como 9.8. Se puede fijar a 0 si no necesita gravedad
    var allowSleep = true; // Permite a los objetos estar en reposo

    world = new b2World(gravity,allowSleep);

    createFloor();
    //Crear algunos cuerpos 
    createRectangularBody();
    createCircularBody();
    createSimplePolyonBody();

    setupDebugDraw();
    animate(); // 105 
}

var timeStep = 1/60;
// La iteraccion sugerida para Box2D es 8 para velocidad y 3 para posicion
var velocityIterations = 8;
var positionIterations = 3;

function animate(){
    world.Step(timeStep,velocityIterations, positionIterations);
    world.ClearForces();

    world.DrawDebugData();

    setTimeout(animate, timeStep);
}

function createFloor(){
    // Una deficnicion body que tiene todos los datos necesarios para contruir un cuerpo rigido 
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 640/2/scale;
    bodyDef.position.y = 450/scale;

    //VARIABLE SCALE PARA CONVERTIR DE METROS A PIXELES

    // Un accesorio se utiliza para unir una forma a un cuerpo para la deteccion de colision
    // La deficion de un accesorio se utiliza para crear un fixture 
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0; // Peso del cuerpo
    fixtureDef.friction = 0.5; // El cuerpo escurre de forma realista
    fixtureDef.restitution = 0.2; // Que el cuerpo rebote (0 nada y 1 muy elástica)
    
    fixtureDef.shape = new b2PolygonShape;
    fixtureDef.shape.SetAsBox(320/scale, 10/scale); // 640 de ancho por 20 de alto
    // Escala variable para crear de pixeles a metros 

    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);

}

var context;
function setupDebugDraw(){
    context = document.getElementById('canvas').getContext('2d');

    var debugDraw = new b2DebugDraw();

    //Utilizar este contexto para dibujar la pantalla de depuracion
    debugDraw.SetSprite(context);
    // Fijar la escala
    debugDraw.SetDrawScale(scale);
    // Rellenar las cajas con transparencia de 0.3
    debugDraw.SetFillAlpha(0.3);
    //Dibujar lineas con espesor 1 
    debugDraw.SetLineThickness(1.0);
    // Mostrar todas las formas y uniones
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    //Empezar a utilizar el dibujo de depuracion en el mundo
    world.SetDebugDraw(debugDraw);
}

function createRectangularBody(){
    
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 40/scale;
    bodyDef.position.y = 100/scale;

    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.3;

    fixtureDef.shape = new b2PolygonShape;
    fixtureDef.shape.SetAsBox(30/scale,50/scale);

    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);
}

function createCircularBody(){
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 130/scale;
    bodyDef.position.y = 100/scale;

    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.7;

    fixtureDef.shape = new b2CircleShape(30/scale);

    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);
}

function createSimplePolyonBody(){
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 230/scale;
    bodyDef.position.y = 50/scale;

    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.2;

    fixtureDef.shape = new b2PolygonShape;
    //Crear un array de puntos b2Vec2 en la direccion de las agujas del reloj
    var points = [
        new b2Vec2(0,0),
        new b2Vec2(40/scale,50/scale),
        new b2Vec2(50/scale,100/scale),
        new b2Vec2(-50/scale,100/scale),
        new b2Vec2(-40/scale,50/scale),
    ];

    //Usar SetAsArray para definir la forma utilizando el array de puntos.
    fixtureDef.shape.SetAsArray(points,points.length);

    var body = world.CreateBody(bodyDef);

    var fixture = body.CreateFixture(fixtureDef);
}