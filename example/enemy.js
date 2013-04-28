/*jslint sloppy: true, browser: true */
/*globals Vectr */

var Enemy = function (x, y, shape, size, color) {
	Vectr.Shape.apply(this, arguments);

	this.color = {
		'red': 255,
		'green': 0,
		'blue': 0,
		'alpha': 1
	};

	this.speed = 80;
	this.size = 40;
	this.shape = 'triangle';
	this.active = false;
	this.bulletTimer = 0;
	this.lineWidth = 3;
};

Enemy.prototype = new Vectr.Shape();