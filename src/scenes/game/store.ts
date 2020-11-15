export const store = {
  game: {
    score: 0,
    multiplier: 0,
    lastMultiplierTime: 0,
    multiplierRemainingTime: 0
  },
  player: {
    body: null
  },
  platforms: [
    {x: window.innerWidth / 2 - 150, y: -window.innerHeight / 2, w: 300}
  ],
  diamonds: [],
  boundaries: {
    left: 0,
    right: 0
  }
}
