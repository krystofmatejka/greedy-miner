import {Application, Container, Text, TextStyle} from 'pixi.js'
import {store} from './store'

export const handleScore = (app: Application, camera: Container) => {
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
