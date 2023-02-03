import { HistoryPusher } from 'services/index'
import routes from 'router/routes'
import * as views from 'views/index'

type ViewType = (typeof views)[keyof typeof views]

const routesCollection = Object.values(routes).map((route) => route.pathname)

const isDefinedPath = (pathname: string) => routesCollection.includes(pathname)

const isMatchedPaths = (currentPathname: string, pathname: string) =>
  currentPathname === pathname

export default class Router {
  private currentPathname = window.location.pathname
  private currentView: ViewType['Layout'] | null = null

  constructor() {
    this.addListeners()
    this.init()

    return this
  }

  private init() {
    const isUnknownRoute = !isDefinedPath(this.currentPathname)

    if (isUnknownRoute) {
      return HistoryPusher.pushTo(routes.notFound.pathname)
    }

    this.renderCurrentView()
  }

  private onChangeUrl() {
    this.currentPathname = window.location.pathname

    this.renderCurrentView()
  }

  private renderCurrentView() {
    Object.values(views).forEach((view) => {
      if (this.isCurrentRoute(view.props.pathname)) {
        if (this.currentView) {
          this.currentView.destroy()
        }

        this.currentView = new view.Layout({
          name: view.props.name,
          props: {
            pathname: view.props.pathname,
            documentTitle: view.props.documentTitle,
            data: view.props.data,
          },
        })

        this.currentView.render()
      }
    })
  }

  private addListeners() {
    new HistoryPusher({
      onChangeURL: this.onChangeUrl.bind(this),
    })
  }

  public isCurrentRoute(pathname: string) {
    return isMatchedPaths(this.currentPathname, pathname)
  }
}
