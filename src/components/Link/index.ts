import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index.'
import HistoryPusher from 'router/HistoryPusher'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface LinkProps extends BaseComponentProps {
  href?: string
  status?: 'primary' | 'default'
  className?: string
}

export default class Link extends BaseComponent<LinkProps> {
  public template = templateString

  constructor(options: BaseComponentOptions = {}) {
    super('link', {
      ...options,
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
        ...(options.listeners || []),
      ],
    })
  }
}
