/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

Vectr.Label = function (x, y, text) {
    Vectr.GameObject.apply(this, arguments);

    this.text = text;

    // Default font
    this.fonts = {
        'size': '20px',
        'family': 'monospaced'
    };

    //this.alignment = ["left", "right", "center", "start", "end"].indexOf(alignment) !== -1 ? alignment : "center";
    this.alignment = 'center';
    this.solid = true;
};

/**
 * @description Set prototype
 */
Vectr.Label.prototype = new Vectr.GameObject();

/**
 * @description Getter/setter for color value
 */
Object.defineProperty(Vectr.Label.prototype, 'color', {
    get: function () {
        return 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
    },
    set: function (color) {
        if (typeof color !== 'string') {
            return;
        }

        var tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);

        if (tmp.length === 5) {
            this.colors.red = parseInt(tmp[1], 10);
            this.colors.green = parseInt(tmp[2], 10);
            this.colors.blue = parseInt(tmp[3], 10);
            this.colors.alpha = parseFloat(tmp[4], 10);
        }
    }
});

/**
 * @description Getter/setter for font value
 */
Object.defineProperty(Vectr.Label.prototype, 'font', {
    get: function () {
        return this.fonts.size + ' ' + this.fonts.family;
    },
    set: function (font) {
        if (typeof font !== 'string') {
            return;
        }

        var tmp = font.split(' '); // e.g. context.font = "20pt Arial";
        if (tmp.length === 2) {
            this.fonts.size = tmp[0];
            this.fonts.family = tmp[1];
        }
    }
});

/**
 * @description Draw object
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Label.prototype.draw = function (context) {
    if (this.active === false) {
        return;
    }

    // Draw child objects first, so they will be on the "bottom"
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x, this.position.y);

    context.save();

    context.font = this.fonts.size + ' ' + this.fonts.family;
    context.textAlign = this.alignment;

    context.translate(this.position.x, this.position.y + parseInt(this.fonts.size, 10) / 3);

    if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
    }

    if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
    }

    if (this.solid === true) {
        context.fillStyle = 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
        context.fillText(this.text, 0, 0, Vectr.WIDTH);
    } else {
        context.strokeStyle = 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
        context.strokeText(this.text, 0, 0, Vectr.WIDTH);
    }

    context.restore();
};

/**
 * @description Update object
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Label.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    // Update child objects
    Vectr.GameObject.prototype.update.call(this, delta);
};

/**
 * @description Utility function to determine the width of the label
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Label.prototype.width = function (context) {
    var metrics;

    context.save();
    context.font = this.fonts.size + ' ' + this.fonts.family;
    context.textAlign = this.alignment;
    metrics = context.measureText(this.text);
    context.restore();

    return metrics.width;
};
