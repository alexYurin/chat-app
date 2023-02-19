import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface LoaderProps extends BaseComponentProps {
  isVisible?: boolean
}

export default class Loader extends BaseComponent<LoaderProps> {
  protected template = templateString

  constructor(props: LoaderProps = {}) {
    super('image', props)
  }
}
