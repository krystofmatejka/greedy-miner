import React, {useRef, useEffect, useState} from 'react'
import {Application, Loader} from 'pixi.js'

const GameScreen = () => {
  const body = useRef<HTMLDivElement>()

  useEffect(() => {
    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight
    })

    body.current.appendChild(app.view)

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
