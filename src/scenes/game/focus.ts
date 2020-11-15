import {Application, Container, filters, Graphics, Rectangle, SCALE_MODES, Sprite} from 'pixi.js'

export const createFocus = (app: Application, camera: Container) => {
  const radius = 250
  const blurSize = 64

  const circle = new Graphics()
    .beginFill(0xffffff)
    .drawCircle(radius + blurSize, radius + blurSize, radius)
    .endFill();
  circle.filters = [new filters.BlurFilter(blurSize)];

  const bounds = new Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2)
  const texture = app.renderer.generateTexture(circle, SCALE_MODES.NEAREST, 1, bounds)
  const focus = new Sprite(texture)
  focus.alpha = 1
  camera.addChild(focus)

  return focus
}
