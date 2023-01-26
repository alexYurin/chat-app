export default function isFunction(fn: unknown): fn is 'function' {
  return typeof fn === 'function'
}
