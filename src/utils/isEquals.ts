export default function objectEquals(obj1: object, obj2: object) {
  const JSONstringifyOrder = (obj) => {
    const keys = {}

    JSON.stringify(obj, (key, value) => {
      keys[key] = null

      return value
    })

    return JSON.stringify(obj, Object.keys(keys).sort())
  }

  return JSONstringifyOrder(obj1) === JSONstringifyOrder(obj2)
}
