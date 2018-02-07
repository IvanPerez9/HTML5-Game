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
}

function createFloor(){
    // Una deficnicion body que tiene todos los datos necesarios para contruir un cuerpo rigido 
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 640/2/scale;
    bodyDef.position.y = 450/scale;

    // Un accesorio se utiliza para unir una forma a un cuerpo para la deteccion de colision
    // La deficion de un accesorio se utiliza para crear un fixture 
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0; // Peso del cuerpo
    fixtureDef.friction = 0.5; // El cuerpo escurre de forma realista
    fixtureDef.restitucion = 0.2; // Que el cuerpo rebote (0 nada y 1 muy elástica)
    
    fixtureDef.shape = new b2PolygonShape;
    fixtureDef.shape.SetAsBox(320/scale, 10/scale); // 640 de ancho por 20 de alto
    // Escala variable para crear de pixeles a metros 

    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);

}