import {Application, Container} from 'pixi.js'

export const createCamera = (app: Application) => {
  const camera = new Container()

  app.stage.addChild(camera)
  camera.pivot.x = 0
  camera.pivot.y = -window.innerHeight
  camera.sortableChildren = true

  return camera
}
