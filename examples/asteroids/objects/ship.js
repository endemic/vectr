/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

/**
 * @constructor Set up shape, color, etc.
 */
var Ship = function () {
    Arcadia.Shape.apply(this, arguments);

    // Standard `Shape` properties
    this.speed = 5;
    this.size = {width: 20, height: 25};
    this.border = '2px #fff';
    this.color = null;
    this.shadow = '0 0 10px #fff';

    // Custom properties
    this.thrust = 0;
    this.MAX_VELOCITY = 0.50;

    this.jet = new Arcadia.Shape({
        vertices: 3,
        border: '2px #fff',
        rotation: Math.PI,
        size: {width: 8, height: 8},
        position: {x: 0, y: 22},
        color: null
    });
    this.add(this.jet);
    this.deactivate(this.jet);
};

Ship.prototype = new Arcadia.Shape();

Ship.prototype.path = function(context) {
    context.moveTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
    context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height * Arcadia.PIXEL_RATIO);
    context.moveTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
    context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height * Arcadia.PIXEL_RATIO);
    context.moveTo(-this.size.width / 3 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
    context.lineTo(this.size.width / 3 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
};

Ship.prototype.update = function (delta) {
    // Rotate the ship based on `angularVelocity`
    this.rotation += this.angularVelocity * delta;

    // Set acceleration based on the angle the ship is pointing
    this.acceleration.x = Math.cos(this.rotation - Math.PI / 2) * this.thrust * delta;
    this.acceleration.y = Math.sin(this.rotation - Math.PI / 2) * this.thrust * delta;

    // Transfer acceleration to velocity
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    var velocityVector = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    // Set a limit on how fast the ship can go
    if (velocityVector > this.MAX_VELOCITY) {
        this.velocity.x += (this.velocity.x / velocityVector) * (this.MAX_VELOCITY - velocityVector);
        this.velocity.y += (this.velocity.y / velocityVector) * (this.MAX_VELOCITY - velocityVector);
    }

    // Finally, update the ship's position
    this.position.x += this.velocity.x * this.speed;
    this.position.y += this.velocity.y * this.speed;
};

Ship.prototype.move = function () {
    this.thrust = 1;
    this.activate(this.jet);
};

Ship.prototype.stop = function () {
    this.thrust = 0;
    this.deactivate(this.jet);
};

Ship.prototype.turnLeft = function () {
    this.angularVelocity = -3;
};

Ship.prototype.turnRight = function () {
    this.angularVelocity = 3;
};

Ship.prototype.stopTurning = function () {
    this.angularVelocity = 0;
};
