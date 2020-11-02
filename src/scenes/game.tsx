import React, {useRef, useEffect, useState} from 'react'
import {Application, Loader, Sprite, utils, Graphics} from 'pixi.js'
import {distance} from 'src/lib'
import {Point} from '../types'

const store = {
  player: {
    body: null
  },
  platforms: [
    {x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 + 16, w: 300},
    {x: window.innerWidth / 2 + 150, y: window.innerHeight / 2 - 150, w: 150},
    {x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 300, w: 150},
  ]
}

const handlePlayer = (app: Application) => {
  addPlayerToStage(app)
  addMouseMovement(app)
}

const addPlayerToStage = (app: Application) => {
  const sprite = new Sprite(utils.TextureCache['ship.png'])

  sprite.x = window.innerWidth / 2
  sprite.y = window.innerHeight / 2

  sprite.width = 32
  sprite.height = 32
  sprite.anchor.set(0.5)
  sprite.interactive = true
  sprite.buttonMode = true

  app.stage.addChild(sprite)

  store.player.body = sprite
}

const addMouseMovement = (app: Application) => {
  const MAX_POWER = 200
  const line1 = drawLine(app)
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
      const c = distance({x: player.x, y: player.y}, event.data.global)
      if (c <= MAX_POWER) {
        cursor.x = event.data.global.x
        cursor.y = event.data.global.y
      }
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
    }
  })
}

const drawLine = (app: Application) => {
  const line = new Graphics()

  line.moveTo(0, 0)
  line.lineTo(0, 0)
  line.endFill()

  app.stage.addChild(line)

  return line
}

const updateLine = (line: Graphics, start: Point, end: Point, color = 0xffffff) => {
  line.clear()
  line.lineStyle(2, color)
  line.moveTo(start.x, start.y)
  line.lineTo(end.x, end.y)
  line.endFill()
}

const handlePlatforms = (app: Application) => {
  store.platforms.forEach((platform) => {
    drawPlatform(app, platform.x, platform.y, platform.w)
  })
}

const drawPlatform = (app: Application, x: number, y: number, width: number) => {
  const graphic = new Graphics()
  graphic.clear()
  graphic.beginFill(0xaaaaaa)
  graphic.drawRect(x, y, width, 10)
  graphic.endFill()

  app.stage.addChild(graphic)
}

const GameScreen = () => {
  const body = useRef<HTMLDivElement>()

  useEffect(() => {
    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight
    })

    body.current.appendChild(app.view)

    handlePlatforms(app)
    handlePlayer(app)
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
