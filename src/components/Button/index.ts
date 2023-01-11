import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index.'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface ButtonProps extends BaseComponentProps {
  type?: HTMLButtonElement['type']
  name?: string
  value?: string
}

export default class Button extends BaseComponent<ButtonProps> {
  public template = templateString

  constructor(options: BaseComponentOptions = {}) {
    super('button', options)
  }
}
