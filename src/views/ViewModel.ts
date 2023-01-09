import Renderer from 'renderer/Renderer'

export type BaseModelType = {
  title: string
}

const SELECTORS = {
  root: '#root',
}

export default class ViewModel<ModelType extends BaseModelType> {
  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  constructor(
    public pathname: string,
    private view: string,
    private model: ModelType
  ) {
    return this
  }

  public render() {
    this.HTMLRootElement.innerHTML = Renderer.toHTML(this.view, this.model)
  }
}
