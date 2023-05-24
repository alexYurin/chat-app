import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface ButtonProps extends BaseComponentProps {
  type?: HTMLButtonElement['type']
  name?: string
  value?: string
  form?: string
}

export default class Button extends BaseComponent<ButtonProps> {
  protected template = templateString

  constructor(props: ButtonProps = {}) {
    super('button', props)
  }
}
