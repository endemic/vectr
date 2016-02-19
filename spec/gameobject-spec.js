describe('Arcadia.GameObject', function () {
    var gameObj,
        points = [{x: 0, y: 0}];

    beforeEach(function () {
        gameObj = new Arcadia.GameObject();
    });

    afterEach(function () {
        gameObj = null;
    });

    describe('constructor', function () {
        xit('assigns options props to instance', function () {

        });
    });

    describe('passthrough methods', function () {
        describe('#draw', function () {
            it('passes through to `children` object', function () {
                var context = null;

                spyOn(gameObj.children, 'draw');
                gameObj.draw(context, points[0].x, points[0].y);

                expect(gameObj.children.draw).toHaveBeenCalledWith(null, 0, 0);
            });
        });

        describe('#update', function () {
            it('passes through to `children` object', function () {
                var delta = 0.5;

                spyOn(gameObj.children, 'update');
                gameObj.update(delta);

                expect(gameObj.children.update).toHaveBeenCalledWith(0.5);
            });
        });

        describe('#add', function () {
            it('passes through to `children` object', function () {
                var shape = new Arcadia.Shape();

                spyOn(gameObj.children, 'add');
                gameObj.add(shape);

                expect(gameObj.children.add).toHaveBeenCalledWith(shape);
            });
        });

        describe('#remove', function () {
            it('passes through to `children` object', function () {
                var shape = new Arcadia.Shape();

                spyOn(gameObj.children, 'remove');
                gameObj.remove(shape);

                expect(gameObj.children.remove).toHaveBeenCalledWith(shape);
            });
        });

        describe('#activate', function () {
            it('passes through to `children` object', function () {
                var shape = new Arcadia.Shape();
                spyOn(gameObj.children, 'activate');
                gameObj.activate(shape);
                expect(gameObj.children.activate).toHaveBeenCalledWith(shape);
            });
        });

        describe('#deactivate', function () {
            it('passes through to `children` object', function () {
                var shape = new Arcadia.Shape();
                spyOn(gameObj.children, 'deactivate');
                gameObj.deactivate(shape);
                expect(gameObj.children.deactivate).toHaveBeenCalledWith(shape);
            });
        });

        describe('#onPointStart', function () {
            describe('point events enabled', function () {
                beforeEach(function () {
                    gameObj.enablePointEvents = true;
                });

                it('passes through to `children` object', function () {
                    spyOn(gameObj.children, 'onPointStart');
                    gameObj.onPointStart(points);
                    expect(gameObj.children.onPointStart).toHaveBeenCalledWith([{x: 0, y: 0}]);
                });
            });

            describe('point events disabled', function () {
                it('does not pass function call through', function () {
                    spyOn(gameObj.children, 'onPointStart');
                    gameObj.onPointStart(points);
                    expect(gameObj.children.onPointStart).not.toHaveBeenCalled();
                });
            });
        });

        describe('#onPointMove', function () {
            describe('point events enabled', function () {
                beforeEach(function () {
                    gameObj.enablePointEvents = true;
                });

                it('passes through to `children` object', function () {
                    spyOn(gameObj.children, 'onPointMove');
                    gameObj.onPointMove(points);
                    expect(gameObj.children.onPointMove).toHaveBeenCalledWith([{x: 0, y: 0}]);
                });
            });

            describe('point events disabled', function () {
                it('does not pass function call through', function () {
                    spyOn(gameObj.children, 'onPointMove');
                    gameObj.onPointMove(points);
                    expect(gameObj.children.onPointMove).not.toHaveBeenCalled();
                });
            });
        });

        describe('#onPointEnd', function () {
            describe('point events enabled', function () {
                beforeEach(function () {
                    gameObj.enablePointEvents = true;
                });

                it('passes through to `children` object', function () {
                    spyOn(gameObj.children, 'onPointEnd');
                    gameObj.onPointEnd(points);
                    expect(gameObj.children.onPointEnd).toHaveBeenCalledWith([{x: 0, y: 0}]);
                });
            });

            describe('point events disabled', function () {
                it('does not pass function call through', function () {
                    spyOn(gameObj.children, 'onPointEnd');
                    gameObj.onPointEnd(points);
                    expect(gameObj.children.onPointEnd).not.toHaveBeenCalled();
                });
            });
        });
    });
});
