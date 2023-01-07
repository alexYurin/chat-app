import BaseComponent, { BaseComponentProps } from 'components/Base/index.'
import pugTemplate from 'bundle-text:./template.pug'
import './styles.scss'

export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit'
  status?: 'primary' | 'default'
  name?: string
  className?: string
}

export default class Button extends BaseComponent<ButtonProps> {
  constructor() {
    super('button')
  }

  template = pugTemplate
}
