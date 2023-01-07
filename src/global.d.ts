import { ComponentNameType, ComponentType } from './components'

declare global {
  interface Window {
    components: {
      [key in ComponentNameType]: ComponentType
    }
  }
}

export {}
