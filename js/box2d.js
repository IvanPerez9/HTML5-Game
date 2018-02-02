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
}