import BaseComponent, { BaseComponentProps } from 'components/Base/index.'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface LinkProps extends BaseComponentProps {
  href?: string
  status?: 'primary' | 'default'
  className?: string
}

export default class Link extends BaseComponent<LinkProps> {
  public template = templateString

  constructor() {
    super('link')
  }
}
