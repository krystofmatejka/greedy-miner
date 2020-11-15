import React, {useEffect, useRef, useState} from 'react'
import {Application, Loader} from 'pixi.js'
import {createCamera} from './camera'
import {createFocus} from './focus'
import {handleBackground} from './background'
import {handlePlatforms} from './platforms'
import {handleDiamonds} from './diamonds'
import {handlePlayer} from './player'
import {handleMagma} from './magma'
import {handleScore} from './score'
import {handleWalls} from './walls'

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

    handleBackground(app, camera, focus)
    handlePlatforms(app, camera, focus)
    handleDiamonds(app, camera, focus)
    handlePlayer(app, camera, focus)
    handleMagma(app, camera, focus)
    handleWalls(app, camera, focus)
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
