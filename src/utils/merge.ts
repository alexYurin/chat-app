import { Indexed } from './types'
import isObject from './isObject'

export default function merge(lhs: Indexed, rhs: Indexed): Indexed {
  for (const key in rhs) {
    if (isObject(lhs[key])) {
      lhs[key] = merge(lhs[key] as Indexed, rhs[key] as Indexed)
    } else {
      lhs[key] = rhs[key]
    }
  }

  return lhs
}
