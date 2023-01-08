import Renderer from 'renderer/Renderer'
import Router from 'router/Router'
import routes from 'router/routes'

export type BaseModelProps = {
  pathname: string
  title: string
}

const SELECTORS = {
  root: '#root',
}

const routesCollection = Object.values(routes).map((route) => route.pathname)

const isDefinedRoute = (pathname: string) => routesCollection.includes(pathname)

const isMatchedRoutes = (currentPathname: string, pathname: string) =>
  currentPathname === pathname

export default class ViewController<ModelProps extends BaseModelProps> {
  private pathname = ''
  private currentPathname = window.location.pathname
  private HTMLRootElement = document.querySelector(SELECTORS.root)

  constructor(private template: string, private props: ModelProps) {
    this.pathname = props.pathname

    this.addListeners()
    this.init()

    return this
  }

  private init() {
    if (!isDefinedRoute(this.currentPathname)) {
      return Router.redirectTo(this.pathname)
    }

    if (isMatchedRoutes(this.currentPathname, this.pathname)) {
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
      isMatchedRoutes(this.currentPathname, this.pathname)
    ) {
      this.HTMLRootElement.innerHTML = Renderer.toHTML(
        this.template,
        this.props
      )
    }
  }

  private addListeners() {
    new Router({
      onChangeURL: this.onChangeUrl.bind(this),
    })
  }
}
