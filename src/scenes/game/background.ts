import {Application, Container, Graphics, SCALE_MODES, Sprite} from 'pixi.js'

export const handleBackground = (app: Application, camera: Container, focus) => {
  const background = drawBackground(app, camera, focus)

  app.ticker.add(() => {
    background.x = camera.pivot.x
    background.y = camera.pivot.y
  })
}

const drawBackground = (app: Application, camera: Container, focus) => {
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(0x272727)
  graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
  graphics.endFill()

  const textureBackground = app.renderer.generateTexture(graphics, SCALE_MODES.LINEAR, 1)

  const background = new Sprite(textureBackground)
  background.width = app.screen.width
  background.height = app.screen.height
  background.mask = focus

  camera.addChild(background)

  return background
}
