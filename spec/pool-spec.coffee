describe 'Arcadia.Pool', ->

  beforeEach ->
    @pool = new Arcadia.Pool()

  afterEach ->
    @pool = null

  describe '#add', ->
    it 'adds objects', ->
      shape = new Arcadia.Shape({ vertices: 3 })
      @pool.add shape
      expect(@pool.at(0)).toBe shape

    it 'increases the length property', ->
      @pool.add new Arcadia.Shape()
      expect(@pool.length).toBe 1

  describe '#remove', ->
    beforeEach ->
      @pool = new Arcadia.Pool()
      while @pool.length < 10
        @pool.add new Arcadia.Shape({ vertices: @pool.length })

    afterEach ->
      @pool = null

    it 'removes objects by index', ->
      @pool.remove 0
      expect(@pool.length).toBe 9

    it 'removes objects by reference', ->
      shape = @pool.at(0)
      @pool.remove shape
      expect(@pool.length).toBe 9

    it 'throws an error without something to remove', ->
      expect(=> @pool.remove()).toThrow()

    it 'calls #destroy on removed object', ->
      shape = @pool.at(0)
      shape.destroy = ->
        console.log 'pass'
      spyOn shape, 'destroy'

      @pool.remove shape
      expect(shape.destroy).toHaveBeenCalled()

    it 'returns removed object', ->
      shape = @pool.at(0)
      returnedOjbect = @pool.remove(0)
      expect(returnedOjbect).toBe shape

  describe '#at', ->
    it 'accesses active objects', ->
      shape = new Arcadia.Shape({ vertices: 3 })
      @pool.add shape
      expect(@pool.at(0)).toBe shape
    
    it "can't access what doesn't exist", ->
      expect(@pool.at(0)).toBe null

  describe '#deactivateAll', ->
    it 'deactivates all objects', ->
      while @pool.length < 10
        @pool.add new Arcadia.Shape({ vertices: @pool.length })
      
      expect(@pool.length).toBe 10
      @pool.deactivateAll()
      expect(@pool.length).toBe 0

  describe '#activateAll', ->
    it 'activates all objects', ->
      while @pool.length < 10
        @pool.add new Arcadia.Shape({ vertices: @pool.length })

      @pool.deactivateAll()
      expect(@pool.length).toBe 0

      @pool.activateAll()
      expect(@pool.length).toBe 10

    it 'resets child objects', ->
      @pool.add new Arcadia.Shape()
      shape = @pool.at(0)
      shape.reset = ->
        console.log 'pass'
      spyOn shape, 'reset'

      @pool.activateAll()
      expect(shape.reset).toHaveBeenCalled()

  describe '#activate', ->
    it 'throws without inactive objects or a factory', ->
      expect(=> @pool.activate()).toThrow()

    it 'can use a factory', ->
      @pool.factory = ->
        new Arcadia.Shape()

      @pool.activate()
      expect(@pool.length).toBe 1

    it 'can use inactive objects', ->
      @pool.add new Arcadia.Shape()
      shape = @pool.deactivate 0
      @pool.activate()
      expect(@pool.at(0)).toBe shape

  describe '#deactivate', ->
    beforeEach ->
      while @pool.length < 10
        @pool.add new Arcadia.Shape({ vertices: @pool.length })

    it 'removes access to object', ->
      shape = @pool.deactivate 0
      expect(@pool.at(0)).not.toBe shape

    it 'can remove by reference', ->
      shape = @pool.at 5
      removedShape = @pool.deactivate shape
      expect(@pool.at(5)).not.toBe removedShape

    it 'decrements `length` property', ->
      @pool.deactivate 0
      expect(@pool.length).toBe 9

  describe '#update', ->
    it 'updates active objects', ->
      pool = new Arcadia.Pool()
      shape1 = new Arcadia.Shape()
      shape2 = new Arcadia.Shape()

      pool.add shape1
      pool.add shape2
      pool.deactivate shape2
      
      spyOn shape1, 'update'
      spyOn shape2, 'update'
      pool.update(1)

      expect(shape1.update).toHaveBeenCalled()
      expect(shape2.update).not.toHaveBeenCalled()

  describe '#draw', ->
    it 'draws active objects', ->
      pool = new Arcadia.Pool()
      shape1 = new Arcadia.Shape()
      shape2 = new Arcadia.Shape()

      pool.add shape1
      pool.add shape2
      pool.deactivate shape1

      spyOn shape1, 'draw'
      spyOn shape2, 'draw'
      pool.draw(1)

      expect(shape2.draw).toHaveBeenCalled()
      expect(shape1.draw).not.toHaveBeenCalled()
