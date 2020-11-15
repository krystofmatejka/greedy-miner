import {Application, Container, Graphics, Sprite, utils} from 'pixi.js'
import {clamp, distance} from '../../lib'
import {Point} from '../../types'
import {store} from './store'

const MAX_POWER = 300

export const handlePlayer = (app: Application, camera: Container, focus) => {
  addPlayerToStage(camera, focus)
  addMouseMovement(app, camera, focus)
}

const addPlayerToStage = (camera: Container, focus) => {
  const sprite = new Sprite(utils.TextureCache['ship'])

  sprite.x = window.innerWidth / 2
  sprite.y = camera.pivot.y / 2 - 16

  sprite.width = 32
  sprite.height = 32
  sprite.anchor.set(0.5)
  sprite.interactive = true
  sprite.buttonMode = true
  sprite.mask = focus
  sprite.zIndex = 10

  camera.addChild(sprite)

  store.player.body = sprite
}

const addMouseMovement = (app: Application, camera: Container, focus) => {
  const line = drawLine(camera)
  const player: Sprite = store.player.body
  let moving = false
  let dragging = false
  let cursor = {x: player.x, y: player.y}

  let velX = 0
  let velY = 0

  player.on('mousedown', (event) => {
    if (!moving) {
      dragging = true
      cursor.x = player.x
      cursor.y = player.y
    }
  })

  player.on('mousemove', (event) => {
    if (dragging) {
      cursor.x = event.data.global.x
      cursor.y = event.data.global.y + camera.pivot.y
    }
  })

  player.on('mouseup', (event) => {
    line.clear()
    dragging = false
  })

  player.on('mouseupoutside', (event) => {
    if (!moving) {
      line.clear()
      dragging = false
      moving = true

      const c = distance({x: player.x, y: player.y}, cursor)
      const power = Math.min(c, MAX_POWER) / MAX_POWER

      const sin = Math.sin(Math.atan2(cursor.y - player.y,cursor.x - player.x) - Math.PI / 2)
      const sinWithMaxValue = clamp(sin, -0.75, 0.75)
      velX = 5 * sinWithMaxValue
      velY = -10 * power
    }
  })

  focus.position.x = player.x - focus.width / 2
  focus.position.y = player.y - focus.height / 2
  app.ticker.add((delta) => {
    if (dragging) {
      updateLine(line, {x: player.x, y: player.y}, cursor)
    }

    if (!dragging && moving) {
      player.x += velX * delta

      velY += 0.2 * delta
      player.y += velY

      focus.position.x = player.x - focus.width / 2
      focus.position.y = player.y - focus.height / 2

      // check for collision
      store.platforms.forEach((platform) => {
        if (
          velY >= 0 &&
          player.x + 16 >= platform.x &&
          player.x - 16 <= platform.x + platform.w &&
          player.y + 16 >= platform.y &&
          player.y - 16 <= platform.y + 10
        ) {
          moving = false
          player.y = platform.y - 16
        }
      })

      store.diamonds.forEach((diamond) => {
        if (
          diamond.visible &&
          player.x + 16 >= diamond.x &&
          player.x - 16 <= diamond.x + 10 &&
          player.y + 16 >= diamond.y &&
          player.y - 16 <= diamond.y + 10
        ) {
          velY = -10
          store.game.score++
          diamond.visible = false
          camera.removeChild(diamond.body)
        }
      })

      if (player.x <= store.boundaries.left) {
        velX *= -1
        if (velY <= 0) {
          velY = -10
        }
      }

      if (player.x >= store.boundaries.right) {
        velX *= -1
        if (velY <= 0) {
          velY = -10
        }
      }

      camera.pivot.y = player.y - window.innerHeight / 2 - 16
    }
  })
}

const drawLine = (camera: Container) => {
  const line = new Graphics()

  line.moveTo(0, 0)
  line.lineTo(0, 0)
  line.endFill()
  line.zIndex = 1

  camera.addChild(line)

  return line
}

const updateLine = (line: Graphics, start: Point, end: Point) => {
  const c = distance(start, end)
  const power = Math.min(c, MAX_POWER) / MAX_POWER

  line.clear()
  line.lineStyle(5 * power, 0xffffff)
  line.moveTo(start.x, start.y)
  line.lineTo(end.x, end.y)
  line.endFill()
}
