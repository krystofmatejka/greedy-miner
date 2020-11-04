import React, {useRef, useEffect, useState} from 'react'
import {Application, Loader, Sprite, utils, Graphics, Container} from 'pixi.js'
import {distance, randomRange} from 'src/lib'
import {Point} from '../types'

const store = {
  player: {
    body: null
  },
  platforms: [
    {x: window.innerWidth / 2 - 150, y: -window.innerHeight / 2, w: 300}
  ]
}

const handlePlayer = (app: Application, camera: Container) => {
  addPlayerToStage(camera)
  addMouseMovement(app, camera)
}

const addPlayerToStage = (camera: Container) => {
  const sprite = new Sprite(utils.TextureCache['ship.png'])

  sprite.x = window.innerWidth / 2
  sprite.y = camera.pivot.y / 2 - 16

  sprite.width = 32
  sprite.height = 32
  sprite.anchor.set(0.5)
  sprite.interactive = true
  sprite.buttonMode = true

  camera.addChild(sprite)

  store.player.body = sprite
}

const addMouseMovement = (app: Application, camera: Container) => {
  const MAX_POWER = 200
  const line1 = drawLine(camera)
  const player: Sprite = store.player.body
  let moving = false
  let dragging = false
  let cursor = {x: 0, y: 0}

  let velX = 0
  let velY = 0

  player.on('mousedown', (event) => {
    line1.clear()
    dragging = true
  })

  player.on('mousemove', (event) => {
    if (dragging) {
      //const c = distance({x: player.x, y: player.y}, event.data.global)
      //if (c <= MAX_POWER) {
        cursor.x = event.data.global.x
        cursor.y = event.data.global.y + camera.pivot.y
      //}
    }
  })

  player.on('mouseupoutside', (event) => {
    line1.clear()
    dragging = false
    moving = true

    const c = distance({x: player.x, y: player.y}, cursor)
    const power = c / MAX_POWER

    const direction = (cursor.x < player.x) ? 1 : -1
    velX = 3 * direction * power
    velY = -10 * power
  })

  app.ticker.add((delta) => {
    if (dragging) {
      updateLine(line1, {x: player.x, y: player.y}, cursor)
    }

    if (!dragging && moving) {
      player.x += velX * delta

      velY += 0.2 * delta
      player.y += velY

      // check for collision
      store.platforms.forEach((platform) => {
        if (
          player.x + 16 >= platform.x &&
          player.x - 16 <= platform.x + platform.w &&
          player.y + 16 >= platform.y &&
          player.y - 16 <= platform.y + 10
        ) {
          moving = false
          player.y = platform.y - 16
        }
      })
      camera.pivot.y = player.y - window.innerHeight / 2 - 16
    }
  })
}

const drawLine = (camera: Container) => {
  const line = new Graphics()

  line.moveTo(0, 0)
  line.lineTo(0, 0)
  line.endFill()

  camera.addChild(line)

  return line
}

const updateLine = (line: Graphics, start: Point, end: Point, color = 0xffffff) => {
  line.clear()
  line.lineStyle(2, color)
  line.moveTo(start.x, start.y)
  line.lineTo(end.x, end.y)
  line.endFill()
}

const handlePlatforms = (app: Application, camera: Container) => {
  store.platforms.forEach((platform) => {
    drawPlatform(app, camera, platform.x, platform.y, platform.w)
  })

  app.ticker.add(() => {
    const lastPlatform = store.platforms[store.platforms.length - 1]

    if ((lastPlatform.y > camera.pivot.y)) {
      const x = randomRange(window.innerWidth / 2 - 200, window.innerWidth / 2 + 200)
      const y = randomRange(lastPlatform.y - 50, lastPlatform.y - 200,)
      const w = randomRange(50, 150)
      const newPlatform = {x, y, w}
      store.platforms.push(newPlatform)
      drawPlatform(app, camera, newPlatform.x, newPlatform.y, newPlatform.w)
    }
  })
}

const drawPlatform = (app: Application, camera: Container, x: number, y: number, width: number) => {
  const graphic = new Graphics()
  graphic.clear()
  graphic.beginFill(0xaaaaaa)
  graphic.drawRect(x, y, width, 10)
  graphic.endFill()

  camera.addChild(graphic)
}

const createCamera = (app: Application) => {
  const camera = new Container()

  app.stage.addChild(camera)
  camera.pivot.x = 0
  camera.pivot.y = -window.innerHeight

  return camera
}

const GameScreen = () => {
  const body = useRef<HTMLDivElement>()

  useEffect(() => {
    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight
    })

    body.current.appendChild(app.view)

    const camera = createCamera(app)
    handlePlatforms(app, camera)
    handlePlayer(app, camera)
  }, [])

  return <div ref={body}/>
}

export const Game = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loader = new Loader()
    loader.add(['ship.png']).load(() => {
      setLoaded(true)
    })
  }, [])

  if (!loaded) { // add loading component
    return null
  }
  return <GameScreen/> // add resources prop
}
