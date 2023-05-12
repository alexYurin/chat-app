import { Indexed } from './types'

export default function isObject(obj: unknown): obj is Indexed {
  return typeof obj === 'object' && obj !== null
}
