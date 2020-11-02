import {Point} from 'src/types'

export const distance = (A: Point, B: Point) => Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2)

export const rightTriangleSides = (A: Point, B: Point) => {
  const a = B.x - A.x
  const b = B.y - A.y
  const c = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2)

  return {a, b, c}
}

export const velocityToPoint = (A: Point, B: Point) => {
  const {a, b, c} = rightTriangleSides(A, B)
  const velocityX = a / c
  const velocityY = b / c

  return {
    velocityX,
    velocityY,
    remainingDistance: c
  }
}

export const degreeToRadian = (degree: number) => degree * Math.PI / 180

export const radianToDegree = (radian: number) => radian * 180 / Math.PI

export const angleToPoint = (a: Point, b: Point) => {
  let angle = Math.atan2(a.x - b.x, a.y - b.y)
  angle += Math.PI / 2
  angle = radianToDegree(angle)

  if (angle < 0) { // fix of atan2 +180/-180 range
    angle = 360 - (-angle)
  }

  return angle
}

export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min
