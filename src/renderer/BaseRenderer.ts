import { RendererType } from 'renderer/Renderer'

export default abstract class BaseRenderer {
  constructor(public name: RendererType) {
    return this
  }

  abstract toHTML<T extends object>(template: string, props: T): string
}
