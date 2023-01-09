import Renderer from 'renderer/Renderer'
import Router from 'router/Router'
import routes from 'router/routes'

export type BaseModelType = {
  pathname: string
  title: string
}

const SELECTORS = {
  root: '#root',
}

const routesCollection = Object.values(routes).map((route) => route.pathname)

const isDefinedPath = (pathname: string) => routesCollection.includes(pathname)

const isMatchedPaths = (currentPathname: string, pathname: string) =>
  currentPathname === pathname

export default class Route<ModelType extends BaseModelType> {
  private pathname = ''
  private currentPathname = window.location.pathname
  private HTMLRootElement = document.querySelector(SELECTORS.root)

  constructor(private view: string, private model: ModelType) {
    this.pathname = model.pathname

    this.addListeners()
    this.init()

    return this
  }

  private init() {
    if (!isDefinedPath(this.currentPathname)) {
      return Router.redirectTo(this.pathname)
    }

    if (isMatchedPaths(this.currentPathname, this.pathname)) {
      this.renderModel()
    }
  }

  private onChangeUrl() {
    this.currentPathname = window.location.pathname

    this.renderModel()
  }

  private renderModel() {
    if (
      Renderer &&
      this.HTMLRootElement &&
      isMatchedPaths(this.currentPathname, this.pathname)
    ) {
      this.HTMLRootElement.innerHTML = Renderer.toHTML(this.view, this.model)
    }
  }

  private addListeners() {
    new Router({
      onChangeURL: this.onChangeUrl.bind(this),
    })
  }
}
