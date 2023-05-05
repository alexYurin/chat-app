import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { ChatMessageType } from 'types/chat'
import { parseDateToTime } from 'utils/index'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface ChatMessageProps extends BaseComponentProps {
  isAuthor: boolean
  message: ChatMessageType
}

export default class ChatMessage extends BaseComponent<ChatMessageProps> {
  protected template = templateString

  constructor(props: ChatMessageProps) {
    super('chatMessage', props)

    this.init()
  }

  protected init() {
    const { message } = this.props

    const time = message.time ? parseDateToTime(new Date(message.time)) : ''

    this.props.children = [message.content, time]
  }
}
