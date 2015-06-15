# TODO

* What the hell, made major changes to which objects get returned in Pool and no tests broke,
  write extra tests which assert the object that is returned/rearranged when activated/deactivated
* [ ] Make setters for size & vertices
* [ ] Handle making canvas cache large enough for shadow/blur
* [ ] Allow strings to be passed for border, font, shadow, etc. instead of objects - use setter methods
* [ ] Ensure correct anchor point for shapes when using large shadows
* [ ] Inset borders so they don't make shapes actually larger
* [ ] RGBA colors don't work for shadows
* [ ] Button "onPointEnd" event listener not getting touch coords on mobile
* [ ] Canvas scaling when pinned to screen in Android is strange
* [ ] Make getters/setters for size & vertices
* [ ] Rename Emitter to "Particles" or something
* [ ] Update particle emitter to emit particles infinitely; can turn on/off
* [ ] Add additional effects to particles: rotate, fade, scale, etc.
* [ ] Give objects a width and height
* [ ] Cull drawing of objects outwide viewport
* [ ] Re-use same <canvas> for each scene
* [ ] Handle Hi-DPI screens - 2x backing store
* [ ] Add SAT collision detection
* [ ] Add "Tween" class to GameObjects
* [ ] Global effects - flash, shake, etc.
* [ ] Refactor offset/child drawing? (perhaps a recursive strategy)
* [ ] Children don't inherit scale/rotation of their parents