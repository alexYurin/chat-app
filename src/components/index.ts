import Button from './Button'
import Link from './Link'

const components = {
  button: new Button(),
  link: new Link(),
}

window.components = components

export type ComponentNameType = keyof typeof components

export type ComponentType = typeof components[ComponentNameType]

export default components
