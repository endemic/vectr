Shape = require './shape.coffee'

class Button extends Shape
  constructor: (args = {}) ->
    Arcadia = require './arcadia.coffee'
    Label = require './label.coffee'

    @padding = args.padding || 10
    @label = args.label || new Label()
    @label.drawCanvasCache() # Draw cache to determine size of text

    args.size =
      width: @label.size.width + @padding
      height: @label.size.height + @padding

    super args

    @label.position = { x: 0, y: 0 }
    @label.fixed = false
    @add(@label)

    @fixed = true

    # Attach event listeners
    @onPointEnd = @onPointEnd.bind(@)
    Arcadia.instance.element.addEventListener('mouseup', @onPointEnd, false)
    Arcadia.instance.element.addEventListener('touchend', @onPointEnd, false)

  ###
  @description If touch/mouse end is inside button, execute the user-supplied callback
  ###
  onPointEnd: (event) ->
    return if typeof @onUp != 'function'

    Arcadia.getPoints(event)

    i = Arcadia.instance.points.length
    while i--
      if @containsPoint(Arcadia.instance.points[i].x, Arcadia.instance.points[i].y)
        @onUp()
        return

  ###
  @description Helper method to determine if mouse/touch is inside button graphic
  ###
  containsPoint: (x, y) ->
    return x < @position.x + @size.width / 2 + @padding / 2 &&
      x > @position.x - @size.width / 2 - @padding / 2 &&
      y < @position.y + @size.height / 2 + @padding / 2 &&
      y > @position.y - @size.height / 2 - @padding / 2

  ###
  @description Clean up event listeners
  ###
  destroy: () ->
    Arcadia.instance.element.removeEventListener 'mouseup', @onPointEnd, false
    Arcadia.instance.element.removeEventListener 'touchend', @onPointEnd, false

  ###
  @description Getter/setter for font value
  ###
  @property 'font',
    get: ->
      return @label.font
    set: (font) ->
      @label.font = font
      @label.dirty = true

module.exports = Button
