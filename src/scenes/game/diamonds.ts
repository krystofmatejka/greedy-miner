import {Application, Container, Graphics} from 'pixi.js'
import {randomRange} from '../../lib'
import {store} from './store'

const COMBO_DURATION_MS = 10000

export const handleDiamonds = (app: Application, camera: Container, focus) => {
  let highestPosition = 0

  app.ticker.add(() => {
    if (camera.pivot.y < highestPosition) {
      highestPosition = camera.pivot.y
      const chance = randomRange(0,10)
      if (chance >= 9.5) {
        const x = randomRange(window.innerWidth / 2 - 200, window.innerWidth / 2 + 200)
        const y = camera.pivot.y
        const body = createDiamond(camera, x, y, true, focus)
        store.diamonds.push({x, y, visible: true, body})
        camera.addChild(body)
      }

      const rawScore = (highestPosition * -1) - 995
      store.game.score = Math.floor(rawScore + (rawScore * (store.game.multiplier + 1) * 0.2))
    }

    store.game.multiplierRemainingTime = (store.game.lastMultiplierTime + COMBO_DURATION_MS) - performance.now()
    if (store.game.multiplier > 0 && store.game.multiplierRemainingTime < 1) {
      store.game.multiplier = 0
    }
  })
}

const createDiamond = (camera: Container, x: number, y: number, visible = true, focus) => {
  const graphic = new Graphics()

  graphic.clear()
  graphic.beginFill(0x4dd7e8)
  graphic.drawStar(x, y, 4, 10)
  graphic.endFill()
  graphic.visible = visible
  graphic.mask = focus

  return graphic
}
