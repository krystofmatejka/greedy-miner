import {Application, Container, Graphics, SCALE_MODES, Sprite} from 'pixi.js'
import {store} from './store'

const GAME_WIDTH = 500

export const handleWalls = (app: Application, camera: Container, focus) => {
  const {leftWall, rightWall} = drawWalls(app, camera)

  app.ticker.add(() => {
    leftWall.y = camera.pivot.y
    rightWall.y = camera.pivot.y
  })
}

const drawWalls = (app: Application, camera: Container) => {
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(0x35464b)
  graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
  graphics.endFill()

  const width = (app.screen.width - GAME_WIDTH) / 2
  const textureBackground = app.renderer.generateTexture(graphics, SCALE_MODES.LINEAR, 1)

  const leftWall = new Sprite(textureBackground)
  leftWall.x = 0
  leftWall.y = -1000
  leftWall.width = width
  leftWall.height = app.screen.height

  const rightWall = new Sprite(textureBackground)
  rightWall.x = app.screen.width - width
  rightWall.y = -1000
  rightWall.width = width
  rightWall.height = app.screen.height

  camera.addChild(leftWall)
  camera.addChild(rightWall)

  store.boundaries.left = width
  store.boundaries.right = app.screen.width - width

  return {
    leftWall,
    rightWall
  }
}
