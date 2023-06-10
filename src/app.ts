import 'styles'
import 'components'
import { Router, routes } from 'router/index'

Object.values(routes).forEach((route) => {
  Router.use(route.View)
})

Router.run()

console.log(classNames('foo', 'bar')) // => 'foo bar'
console.log(classNames('foo', { bar: true })) // => 'foo bar'
console.log(classNames({ 'foo-bar': true })) // => 'foo-bar'
console.log(classNames({ 'foo-bar': false })) // => ''
console.log(classNames({ foo: true }, { bar: true })) // => 'foo bar'
console.log(classNames({ foo: true, bar: true })) // => 'foo bar'
console.log(
  classNames('foo', { bar: true, duck: false }, 'baz', { quux: true })
) // => 'foo bar baz quux'
console.log(classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, '')) // => 'bar 1'
console.log(classNames('bar', [1, null, 'baz'], { baz: true }, '3')) // => 'bar 1 baz baz 3'
console.log(
  classNames('bar', [1, null, 'baz', ['foo', 'test']], { baz: true }, '3')
) // => 'bar 1 baz foo test baz 3'

function flatten(arr: any[]): any[] {
  return arr.reduce((acc, curVal) => {
    return acc.concat(Array.isArray(curVal) ? flatten(curVal) : curVal)
  }, [])
}

function classNames(...args: any[]) {
  const classNamesResult: string[] = []

  Array.from(args).forEach((el) => {
    if (typeof el === 'string' || (typeof el === 'number' && el > 0)) {
      classNamesResult.push(`${el}`)
    } else if (Array.isArray(el)) {
      const flatArr = flatten(el).filter((_el: any) => Boolean(_el))

      flatArr.forEach((_el: any) => {
        classNamesResult.push(_el)
      })
    } else if (typeof el === 'object' && el !== null) {
      Object.keys(el).forEach((key) => {
        const elem = el as Record<string, string>

        if (elem[key]) {
          classNamesResult.push(key)
        }
      })
    }
  })

  return classNamesResult.join(' ')
}
