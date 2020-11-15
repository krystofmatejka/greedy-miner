import {Application, Container, Text, TextStyle, Graphics, Sprite, SCALE_MODES} from 'pixi.js'
import {store} from './store'

export const handleScore = (app: Application, camera: Container) => {
  const style = new TextStyle({
    fill: 'white'
  })
  const text = new Text('score', style)
  text.x = 0

  camera.addChild(text)
  const status = drawComboStatus(app, camera)

  app.ticker.add(() => {
    text.y = camera.pivot.y
    text.text = `score: ${store.game.score}\ncombo: ${store.game.multiplier}`

    status.y = camera.pivot.y + 70
    if (store.game.multiplier > 0) {
      const width = Math.floor(store.game.multiplierRemainingTime / 100)
      if (width > 1) {
        status.width = width
      }
    }
  })
}

const drawComboStatus = (app: Application, camera: Container) => {
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(0xffffff)
  graphics.drawRect(0, 0, 1, 1)
  graphics.endFill()

  const texture = app.renderer.generateTexture(graphics, SCALE_MODES.LINEAR, 1)
  const status = new Sprite(texture)
  status.x = 0
  status.y = 0

  status.width = 1
  status.height = 10

  camera.addChild(status)

  return status
}
