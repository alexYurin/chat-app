import BaseComponent, {
  BaseComponentProps,
  ComponentBrowserEventListenerPropType,
} from 'components/Base/index'
import { HistoryPusher } from 'services/index'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface LinkProps extends BaseComponentProps {
  href: string
  isRoute?: boolean
}

export default class Link extends BaseComponent<LinkProps> {
  private routeListener = [] as ComponentBrowserEventListenerPropType[]
  protected template = templateString

  constructor(
    props: LinkProps = {
      href: '#',
    }
  ) {
    super('link', props)

    const onClickEvent = {
      eventType: 'click',
      callback: (event: Event) => {
        const target = event.target

        if (target instanceof HTMLAnchorElement) {
          event.preventDefault()

          HistoryPusher.pushTo(target.href)
        }
      },
    }

    this.routeListener = this.props.isRoute
      ? [onClickEvent]
      : ([] as ComponentBrowserEventListenerPropType[])

    this.props = {
      ...this.props,
      listeners: [...this.routeListener, ...(this.props.listeners || [])],
    }
  }
}
