import {Application, Container, Graphics, SCALE_MODES, Sprite} from 'pixi.js'
import {store} from './store'

export const handleMagma = (app: Application, camera: Container, focus) => {
  const player: Sprite = store.player.body
  const magma = drawMagma(app, camera, focus)

  app.ticker.add(() => {
    magma.y -= 1

    if (
      player.x + 16 >= magma.x &&
      player.x - 16 <= magma.x + window.innerWidth &&
      player.y + 16 >= magma.y &&
      player.y - 16 <= magma.y + 10
    ) {
      app.ticker.destroy()
    }
  })
}

const drawMagma = (app: Application, camera: Container, focus) => {
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(0xff0000)
  graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
  graphics.endFill()

  const texture = app.renderer.generateTexture(graphics, SCALE_MODES.LINEAR, 1)
  const magma = new Sprite(texture)
  magma.mask = focus

  magma.x = 0
  magma.y = 0

  camera.addChild(magma)

  return magma
}
