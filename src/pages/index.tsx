import React from 'react'
import dynamic from 'next/dynamic'

const Game = dynamic(() => import('../scenes/game').then(mod => mod.Game), {
  loading: () => <div>loading...</div>,
  ssr: false
})

export default Game
