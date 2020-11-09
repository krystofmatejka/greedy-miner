import React, {useRef, useEffect, useState} from 'react'
import {Application, Loader, Sprite, utils, Graphics, Container, SCALE_MODES, Text, TextStyle, filters, Rectangle} from 'pixi.js'
import {distance, randomRange, clamp} from 'src/lib'
import {Point} from '../types'

const store = {
  game: {
    score: 0
  },
  player: {
    body: null
  },
  platforms: [
    {x: window.innerWidth / 2 - 150, y: -window.innerHeight / 2, w: 300}
  ],
  diamonds: []
}

const handlePlayer = (app: Application, camera: Container, focus) => {
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

  camera.addChild(sprite)

  store.player.body = sprite
}

const addMouseMovement = (app: Application, camera: Container, focus) => {
  const MAX_POWER = 300
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
      cursor.x = event.data.global.x
      cursor.y = event.data.global.y + camera.pivot.y
    }
  })

  player.on('mouseupoutside', (event) => {
    line1.clear()
    dragging = false
    moving = true

    const c = distance({x: player.x, y: player.y}, cursor)
    const power = Math.min(c, MAX_POWER) / MAX_POWER

    const sin = Math.sin(Math.atan2(cursor.y - player.y,cursor.x - player.x) - Math.PI / 2)
    const sinWithMaxValue = clamp(sin, -0.5, 0.5)
    velX = 5 * sinWithMaxValue
    velY = -10 * power
  })

  focus.position.x = player.x - focus.width / 2
  focus.position.y = player.y - focus.height / 2
  app.ticker.add((delta) => {
    if (dragging) {
      updateLine(line1, {x: player.x, y: player.y}, cursor)
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
          store.game.score++
          diamond.visible = false
          camera.removeChild(diamond.body)
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

const handlePlatforms = (app: Application, camera: Container, focus) => {
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

const handleDiamonds = (app: Application, camera: Container, focus) => {
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

const handleMagma = (app: Application, camera: Container, focus) => {
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

const handleScore = (app: Application, camera: Container) => {
  const style = new TextStyle({
    fill: 'white'
  })
  const text = new Text('score', style)
  text.x = 0

  camera.addChild(text)

  app.ticker.add(() => {
    text.y = camera.pivot.y
    text.text = `score: ${store.game.score}`
  })
}

const createCamera = (app: Application) => {
  const camera = new Container()

  app.stage.addChild(camera)
  camera.pivot.x = 0
  camera.pivot.y = -window.innerHeight

  return camera
}

const createFocus = (app: Application, camera: Container) => {
  const radius = 250
  const blurSize = 64

  const circle = new Graphics()
    .beginFill(0xffffff)
    .drawCircle(radius + blurSize, radius + blurSize, radius)
    .endFill();
  circle.filters = [new filters.BlurFilter(blurSize)];

  const bounds = new Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2)
  const texture = app.renderer.generateTexture(circle, SCALE_MODES.NEAREST, 1, bounds)
  const focus = new Sprite(texture)
  focus.alpha = 1
  camera.addChild(focus)

  return focus
}

const createBackground = (app: Application, camera: Container, focus) => {
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

const GameScreen = () => {
  const body = useRef<HTMLDivElement>()

  useEffect(() => {
    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight
    })

    body.current.appendChild(app.view)

    const camera = createCamera(app)
    const focus = createFocus(app, camera)

    createBackground(app, camera, focus)
    handlePlatforms(app, camera, focus)
    handleDiamonds(app, camera, focus)
    handlePlayer(app, camera, focus)
    handleMagma(app, camera, focus)
    handleScore(app, camera)
  }, [])

  return <div ref={body}/>
}

export const Game = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loader = new Loader()
    loader
      .add('ship', 'ship.png')
      .add('platform', 'platform.png')
      .load(() => {
      setLoaded(true)
    })
  }, [])

  if (!loaded) { // add loading component
    return null
  }
  return <GameScreen/> // add resources prop
}
