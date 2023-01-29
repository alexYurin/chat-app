import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { HistoryPusher } from 'services/index'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface LinkProps extends BaseComponentProps {
  href: string
}

export default class Link extends BaseComponent<LinkProps> {
  public template = templateString

  constructor(
    props: LinkProps = {
      href: '',
    }
  ) {
    super('link', props)

    this.props = {
      href: '',
      listeners: [
        {
          eventType: 'click',
          callback: (event: Event) => {
            const target = event.target

            if (target instanceof HTMLAnchorElement) {
              event.preventDefault()

              HistoryPusher.pushTo(target.href)
            }
          },
        },
        ...(this.props.listeners || []),
      ],
    }
  }
}
