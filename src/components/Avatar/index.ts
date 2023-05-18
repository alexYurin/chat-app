import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import templateString from 'bundle-text:./template.pug'

import avatarPlaceholderSrc from 'data-url:static/images/avatar-placeholder.svg'
import './styles.scss'

export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt: string
  size?: number
  title?: string
}

export default class Avatar extends BaseComponent<AvatarProps> {
  protected template = templateString
  protected disableRenderPropsList = ['src']

  static defaultAvatarSrc = avatarPlaceholderSrc

  constructor(
    props: AvatarProps = {
      src: Avatar.defaultAvatarSrc,
      alt: 'avatar',
    }
  ) {
    super('avatar', props)
  }
}
