import {Application, Container, Sprite, utils} from 'pixi.js'
import {randomRange} from '../../lib'
import {store} from './store'

const MAX_WIDTH = 128

export const handlePlatforms = (app: Application, camera: Container, focus) => {
  store.platforms.forEach((platform) => {
    drawPlatform(app, camera, platform.x, platform.y, platform.w, focus)
  })

  app.ticker.add(() => {
    const lastPlatform = store.platforms[store.platforms.length - 1]

    if ((lastPlatform.y > camera.pivot.y)) {
      const x = randomRange(store.boundaries.left, store.boundaries.right - MAX_WIDTH)
      const y = randomRange(lastPlatform.y - 100, lastPlatform.y - 150,)
      const w = randomRange(48, MAX_WIDTH)
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
