import merge from './merge'
import isObject from './isObject'
import { Indexed } from './types'

const createObjFromPath = (path: string, value: unknown) => {
  const keys = path.split('.').reverse()

  return keys.reduce((res, key, index) => {
    res = {
      [key]: index === 0 ? value : res,
    }

    return res
  }, {} as Indexed)
}

export default function set(
  object: Indexed | unknown,
  path: string,
  value: unknown
): Indexed | unknown {
  if (typeof path !== 'string') {
    throw new Error('path must be string')
  }

  if (isObject(object)) {
    const newObject = createObjFromPath(path, value)

    object = merge(object, newObject)
  }

  return object
}
