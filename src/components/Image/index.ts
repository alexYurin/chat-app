import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import templateString from './template.pug'

import './styles.scss'

export interface ImageProps extends BaseComponentProps {
  src: string
  alt: string
}

export default class Avatar extends BaseComponent<ImageProps> {
  protected template = templateString

  constructor(
    props: ImageProps = {
      src: '#',
      alt: 'image',
    }
  ) {
    super('image', props)
  }
}
