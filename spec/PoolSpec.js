/*jslint sloppy: true */
/*global describe: false, it: false, expect: false, beforeEach: false, afterEach: false, Vectr: false */

describe('Vectr.Pool', function () {
    var pool;

    beforeEach(function () {
        pool = new Vectr.Pool();
    });

    afterEach(function () {
        pool = null;
    });

    it('has a length property', function () {
        expect(pool.length).toBe(0);
    });

    it('can have Vectr objects added to it', function () {
        var shape = new Vectr.Shape(0, 0, 'circle', 25);
        pool.add(shape);
        expect(pool.length).toBe(1);
        expect(pool.at(0)).toBe(shape);
    });

    it("can't have non-Vectr objects added to it", function () {
        var obj = {
            property: "fgsfds"
        };

        expect(function () { pool.add(obj); }).toThrow();
    });

    it("doesn't allow direct access of inactive objects", function () {
        var shape = new Vectr.Shape(0, 0, 'circle', 25);
        shape.active = false;
        pool.add(shape);
        expect(pool.length).toBe(0);
        expect(pool.at(0)).toBeNull();
    });

    it("updates its' active child objects", function () {
        var activeShape,
            inactiveShape;

        activeShape = new Vectr.Shape(0, 0, 'circle', 25);
        activeShape.velocity.x = 10;

        inactiveShape = new Vectr.Shape(0, 0, 'circle', 25);
        inactiveShape.velocity.x = 10;
        inactiveShape.active = false;

        pool.add(activeShape);
        pool.add(inactiveShape);

        pool.update(1);

        expect(activeShape.position.x).toBe(10);
        expect(inactiveShape.position.x).toBe(0);
    });

    it("updates inactive objects out of its list of active children", function () {
        var shape = new Vectr.Shape(0, 0, 'circle', 25);
        pool.add(shape);

        expect(pool.length).toBe(1);

        shape.active = false;
        pool.update(1);

        expect(pool.length).toBe(0);
        expect(pool.at(0)).toBeNull();
    });
});