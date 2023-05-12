import { Indexed } from './types'
import isObject from './isObject'

const JSONStringifyOrder = (obj: unknown) => {
  const keys = {} as Indexed

  JSON.stringify(obj, (key, value) => {
    keys[key] = null

    return value
  })

  return JSON.stringify(obj, Object.keys(keys).sort())
}

export function isEqual(object1: Indexed, object2: Indexed): boolean {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)

    if (
      (areObjects && !isEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false
    }
  }

  return true
}

console.log('isEqual', isEqual({ a: [1, 2] }, { a: [1, 2] }))

export default function isEquals(obj1: unknown, obj2: unknown) {
  return JSONStringifyOrder(obj1) === JSONStringifyOrder(obj2)
}
