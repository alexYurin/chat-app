import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index'
import { HistoryPusher } from 'services/index'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface LinkProps extends BaseComponentProps {
  href: string
}

export default class Link extends BaseComponent<LinkProps> {
  public template = templateString

  constructor(
    props: LinkProps = { href: '' },
    options: BaseComponentOptions = {}
  ) {
    super('link', props, {
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
