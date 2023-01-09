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
  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  constructor(private view: string, private model: ModelType) {
    this.pathname = model.pathname

    this.addListeners()
    this.init()

    return this
  }

  private init() {
    const isUnknownRoute = !isDefinedPath(this.currentPathname)

    if (isUnknownRoute) {
      return Router.redirectTo(routes.notFound.pathname)
    }

    if (this.isCurrentRoute()) {
      this.renderModel()
    }
  }

  private onChangeUrl() {
    this.currentPathname = window.location.pathname

    this.renderModel()
  }

  private renderModel() {
    if (this.isCurrentRoute()) {
      this.HTMLRootElement.innerHTML = Renderer.toHTML(this.view, this.model)
    }
  }

  private addListeners() {
    new Router({
      onChangeURL: this.onChangeUrl.bind(this),
    })
  }

  public isCurrentRoute() {
    return isMatchedPaths(this.currentPathname, this.pathname)
  }
}
