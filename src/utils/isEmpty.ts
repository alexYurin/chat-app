export default function isEmpty(value: unknown): boolean {
  if (typeof value === 'boolean' || typeof value === 'number') {
    return true
  } else if (typeof value === 'string') {
    return value === ''
  } else if (Array.isArray(value)) {
    return value.length === 0
  } else if (value instanceof Set || value instanceof Map) {
    return value.size === 0
  } else if (value instanceof Object) {
    return Object.keys(value).length === 0
  }

  return !value
}
