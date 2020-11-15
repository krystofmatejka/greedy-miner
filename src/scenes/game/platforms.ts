import {Application, Container, Sprite, utils} from 'pixi.js'
import {randomRange} from '../../lib'
import {store} from './store'

export const handlePlatforms = (app: Application, camera: Container, focus) => {
  store.platforms.forEach((platform) => {
    drawPlatform(app, camera, platform.x, platform.y, platform.w, focus)
  })

  app.ticker.add(() => {
    const lastPlatform = store.platforms[store.platforms.length - 1]

    if ((lastPlatform.y > camera.pivot.y)) {
      const x = randomRange(window.innerWidth / 2 - 200, window.innerWidth / 2 + 200)
      const y = randomRange(lastPlatform.y - 50, lastPlatform.y - 200,)
      const w = randomRange(50, 150)
      const newPlatform = {x, y, w}
      store.platforms.push(newPlatform)
      drawPlatform(app, camera, newPlatform.x, newPlatform.y, newPlatform.w, focus)
    }
  })
}

const drawPlatform = (app: Application, camera: Container, x: number, y: number, width: number, focus) => {
  const sprite = new Sprite(utils.TextureCache['platform'])

  sprite.x = x
  sprite.y = y
  sprite.width = width
  sprite.height = 16
  sprite.mask = focus

  camera.addChild(sprite)
}
