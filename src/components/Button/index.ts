import BaseComponent, { BaseComponentProps } from 'components/Base/index.'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit'
  status?: 'primary' | 'default'
  name?: string
  className?: string
}

class Button extends BaseComponent<ButtonProps> {
  public template = templateString

  constructor() {
    super('button')
  }
}

export default new Button()
