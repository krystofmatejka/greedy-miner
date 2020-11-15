import {Application, Container, Graphics, SCALE_MODES, Sprite} from 'pixi.js'

export const createBackground = (app: Application, camera: Container, focus) => {
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(0x000000)
  graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
  graphics.endFill()

  const textureBackground = app.renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 1)

  const background = new Sprite(textureBackground)
  camera.addChild(background)
  background.width = app.screen.width
  background.height = app.screen.height

  background.mask = focus
}
