import Renderer from 'renderer'

export interface BaseComponentProps {
  slot?: string
}

export default class BaseComponent<PropsType extends BaseComponentProps> {
  public template = ''

  constructor(public name: string | null = null) {
    if (typeof name === 'string') {
      return this
    } else {
      throw new Error(`Invalid component name: ${this.name}`)
    }
  }

  public create(props: PropsType): string {
    if (Renderer) {
      return Renderer.toHTML(this.template, props)
    }

    return ''
  }
}
