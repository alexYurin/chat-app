import isObject from './isObject'
import isArray from './isArray'
import { Indexed } from './types'

export default function cloneDeep<T extends object = object>(obj: T) {
  const cloneObject = (isArray(obj) ? [] : {}) as Indexed

  let value

  for (const key in obj) {
    value = obj[key]

    cloneObject[key] = isObject(value) ? cloneDeep(value) : value
  }

  return cloneObject
}
