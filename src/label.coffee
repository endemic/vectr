GameObject = require './gameobject.coffee'

class Label extends GameObject
  constructor: (x, y, text) ->
    super

    @text = text
    @fixed = true
    @font = '10px monospace'
    @alignment = 'center' # allowed values: "left", "right", "center", "start", "end"
    @solid = true

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX, offsetY) ->
    # Draw child objects first, so they will be on the "bottom"
    super context, @position.x + offsetX, @position.y + offsetY

    offsetX = offsetY = 0 if @fixed

    context.save()

    context.font = @font
    context.textAlign = @alignment

    # TODO: figure out a more reliable way to vertically center text
    context.translate @position.x + offsetX, @position.y + parseInt(@fonts.size, 10) / 3 + offsetY
    context.scale @scale, @scale if @scale != 1
    context.rotate @rotation if @rotation != 0 && @rotation != Math.PI * 2

    if @shadow.x and @shadow.y and @shadow.blur
      context.shadowOffsetX = @shadow.x
      context.shadowOffsetY = @shadow.y
      context.shadowBlur = @shadow.blur
      context.shadowColor = @shadow.color

    if @solid
      context.fillStyle = @color
      context.fillText @text, 0, 0, Arcadia.WIDTH
    else
      context.strokeStyle = @color
      context.strokeText @text, 0, 0, Arcadia.WIDTH

    context.restore()

  ###
  @description Utility function to determine the width of the label
  @param {CanvasRenderingContext2D} context
  ###
  width: (context) ->
    context.save()
    context.font = @font
    context.textAlign = @alignment
    metrics = context.measureText @text
    context.restore()

    return metrics.width

module.exports = Label