const JSONStringifyOrder = (obj: any) => {
  const keys = {}

  JSON.stringify(obj, (key, value) => {
    keys[key] = null

    return value
  })

  return JSON.stringify(obj, Object.keys(keys).sort())
}

export default function objectEquals(obj1: any, obj2: any) {
  return JSONStringifyOrder(obj1) === JSONStringifyOrder(obj2)
}
