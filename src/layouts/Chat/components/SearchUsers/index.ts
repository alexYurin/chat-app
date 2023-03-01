import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export default class ChatSearchUsers extends BaseComponent<BaseComponentProps> {
  protected template = templateString

  constructor(props: BaseComponentProps) {
    super('chatSearch', props)
  }
}
