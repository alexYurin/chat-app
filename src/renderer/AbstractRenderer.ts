import { RendererType } from 'renderer'

export default abstract class BaseRenderer {
  constructor(public name: RendererType) {
    return this
  }

  abstract toHTML<T extends object>(template: string, props: T): string
}
