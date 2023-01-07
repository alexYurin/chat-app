import BaseComponent, { BaseComponentProps } from 'components/Base/index.'
import pugTemplate from 'bundle-text:./template.pug'
import './styles.scss'

export interface LinkProps extends BaseComponentProps {
  href?: string
  status?: 'primary' | 'default'
  className?: string
}

export default class Button extends BaseComponent<LinkProps> {
  constructor() {
    super('button')
  }

  template = pugTemplate
}
