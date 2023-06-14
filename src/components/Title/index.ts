import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import templateString from './template.pug'

import './styles.scss'

export interface TitleProps extends BaseComponentProps {
  level?: number
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

export default class Title extends BaseComponent<TitleProps> {
  protected template = templateString

  constructor(props: TitleProps = {}) {
    super('title', props)
  }
}
